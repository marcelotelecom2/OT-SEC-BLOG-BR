interface Env {
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
}

export interface PagesContext { request: Request; env: Env }
const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function hmac(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToBase64(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))))
    .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export async function createSession(env: Env): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const payload = `${expires}`;
  return `${payload}.${await hmac(env.ADMIN_SESSION_SECRET, payload)}`;
}

export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const token = request.headers.get('Cookie')?.match(/(?:^|;\s*)ot_sec_session=([^;]+)/)?.[1];
  if (!token) return false;
  const [expires, signature, extra] = token.split('.');
  if (extra || !expires || !signature || Number(expires) < Date.now() / 1000) return false;
  return signature === await hmac(env.ADMIN_SESSION_SECRET, expires);
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) throw new Error('Origem da solicitação inválida.');
}

export function json(value: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function githubConfig(env: Env) {
  return {
    owner: env.GITHUB_OWNER || 'marcelotelecom2',
    repo: env.GITHUB_REPO || 'OT-SEC-BLOG-BR',
    branch: env.GITHUB_BRANCH || 'main',
  };
}

async function github<T>(env: Env, path: string, init?: RequestInit): Promise<T> {
  if (!env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN não configurado no Cloudflare Pages.');
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json', Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ot-sec-blog-admin',
      'Content-Type': 'application/json', ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`GitHub recusou a alteração (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function readRepositoryFile(env: Env, path: string): Promise<string> {
  const { owner, repo, branch } = githubConfig(env);
  const file = await github<{ content: string }>(env, `/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`);
  return new TextDecoder().decode(base64ToBytes(file.content.replace(/\s/g, '')));
}

export async function commitFiles(env: Env, files: Map<string, string | Uint8Array>, message: string): Promise<string> {
  const { owner, repo, branch } = githubConfig(env);
  const ref = await github<{ object: { sha: string } }>(env, `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
  const commit = await github<{ tree: { sha: string } }>(env, `/repos/${owner}/${repo}/git/commits/${ref.object.sha}`);
  const tree = [] as Array<{ path: string; mode: '100644'; type: 'blob'; sha: string }>;
  for (const [path, content] of files) {
    const blob = await github<{ sha: string }>(env, `/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST', body: JSON.stringify(typeof content === 'string'
        ? { content, encoding: 'utf-8' }
        : { content: bytesToBase64(content), encoding: 'base64' }),
    });
    tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const newTree = await github<{ sha: string }>(env, `/repos/${owner}/${repo}/git/trees`, {
    method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree }),
  });
  const next = await github<{ sha: string }>(env, `/repos/${owner}/${repo}/git/commits`, {
    method: 'POST', body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  });
  await github(env, `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: 'PATCH', body: JSON.stringify({ sha: next.sha, force: false }),
  });
  return next.sha;
}

export function metadataSource(entries: unknown[]): string {
  return "import type { ArticleMetadata } from '../../lib/articleMetadata';\n"
    + "export type { ArticleMetadata } from '../../lib/articleMetadata';\n\n"
    + `export const ARTICLES_METADATA: ArticleMetadata[] = ${JSON.stringify(entries, null, 2)};\n`;
}

export function parseMetadataSource(source: string): any[] {
  const marker = 'export const ARTICLES_METADATA: ArticleMetadata[] = ';
  const start = source.indexOf(marker);
  if (start < 0) throw new Error('Registro de artigos inválido.');
  return JSON.parse(source.slice(start + marker.length).trim().replace(/;$/, ''));
}
