import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import { onRequestGet, onRequestPut, onRequestDelete } from './radar';
import { createSession } from './_shared';

const env = { ADMIN_PASSWORD: 'test-only', ADMIN_SESSION_SECRET: 'test-only-radar-session-secret-long', GITHUB_TOKEN: 'test-only' };
Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
const entry = { id: 'fixture-only', type: 'advisory', title: 'Validation title', date: '2026-10-20', sourceName: 'Validation source',
  sourceUrl: 'https://example.com/source', comment: 'Validation commentary', published: true, sourceLanguage: 'en' };

test('Radar API rejects unauthenticated writes and cross-origin requests', async () => {
  const request = new Request('https://example.com/api/admin/radar', { method: 'PUT' });
  assert.equal((await onRequestPut({ request, env })).status, 401);
  const cross = new Request(request, { headers: { Origin: 'https://other.example' } });
  assert.equal((await onRequestPut({ request: cross, env })).status, 403);
});

test('manual save commits reviewed data, unpublish preserves it, and errors do not report success', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let registry: unknown[] = [];
  let writes = 0;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes('/contents/')) return Response.json({ content: Buffer.from(JSON.stringify(registry)).toString('base64') });
    if (url.includes('/git/ref/heads/')) return Response.json({ object: { sha: 'head' } });
    if (url.endsWith('/git/commits/head')) return Response.json({ tree: { sha: 'tree' } });
    if (url.endsWith('/git/blobs')) {
      const body = JSON.parse(init!.body as string); registry = JSON.parse(body.content); writes++;
      return Response.json({ sha: 'blob' });
    }
    return Response.json({ sha: 'commit' });
  };
  const cookie = `ot_sec_session=${await createSession(env)}`;
  const request = (method: string, body?: unknown) => new Request('https://example.com/api/admin/radar', {
    method, headers: { Cookie: cookie, Origin: 'https://example.com' }, ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal((await onRequestPut({ request: request('PUT', { entry: { ...entry, sourceUrl: '' } }), env })).status, 400);
  assert.equal(writes, 0);
  assert.equal((await onRequestPut({ request: request('PUT', { entry }), env })).status, 200);
  const data = await (await onRequestGet({ request: request('GET'), env })).json() as any;
  assert.deepEqual(data.entries, [entry]);
  assert.equal((await onRequestDelete({ request: request('DELETE', { id: entry.id }), env })).status, 200);
  assert.deepEqual(registry, [{ ...entry, published: false }]);
  globalThis.fetch = async () => new Response('Failure', { status: 500 });
  assert.equal((await onRequestPut({ request: request('PUT', { entry }), env })).status, 400);
});
