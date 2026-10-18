import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { ARTICLES_METADATA, type ArticleMetadata } from '../src/content/articles/metadata';
import { parseArticleExport } from '../src/lib/articleExport';

export interface ImportPlan {
  files: Map<string, string | Buffer>;
  articleId: string;
  slug: string;
  replacing: boolean;
}

export function planArticleImport(value: unknown, existing: ArticleMetadata[]): ImportPlan {
  const { article } = parseArticleExport(value);
  if (!article.published) {
    throw new Error('O arquivo contém um rascunho. Marque "Pronto para publicar" no editor antes de importar no site.');
  }
  if (existing.some(item => item.slug === article.slug && item.id !== article.id)) {
    throw new Error(`Slug já utilizado por outro artigo: ${article.slug}`);
  }
  const previous = existing.find(item => item.id === article.id);
  const contentFile = previous?.contentFile ?? `${article.slug}.md`;
  if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(contentFile)) throw new Error('Nome de arquivo de conteúdo inválido.');
  if (existing.some(item => item.contentFile === contentFile && item.id !== article.id)) {
    throw new Error(`Arquivo já utilizado por outro artigo: ${contentFile}`);
  }

  const files = new Map<string, string | Buffer>();
  const imagePattern = /data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/]+={0,2})/g;
  const extractImages = (text: string) => text.replace(imagePattern, (_match, mime: string, data: string) => {
    const bytes = Buffer.from(data, 'base64');
    if (!bytes.length || bytes.toString('base64').replace(/=+$/, '') !== data.replace(/=+$/, '')) {
      throw new Error('Imagem base64 inválida.');
    }
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    const extension = mime === 'svg+xml' ? 'svg' : mime === 'jpeg' ? 'jpg' : mime;
    const imagePath = `images/articles/${article.slug}-${hash}.${extension}`;
    files.set(`public/${imagePath}`, bytes);
    return `/${imagePath}`;
  });

  const content = extractImages(article.content!);
  const coverImage = article.coverImage ? extractImages(article.coverImage) : undefined;
  if (/data:|blob:/i.test(coverImage ?? '') || /(?:\]\(|src=["'])\s*(?:data:|blob:)/i.test(content)) {
    throw new Error('Há uma imagem temporária ou não suportada. Use PNG, JPEG, GIF, WebP ou SVG em base64, ou uma URL permanente.');
  }
  const { content: _content, views: _views, ...editorial } = article;
  const metadata: ArticleMetadata = { ...editorial, contentFile, views: 0 };
  if (coverImage) metadata.coverImage = coverImage;
  const entries = previous
    ? existing.map(item => item.id === article.id ? metadata : item)
    : [metadata, ...existing];

  files.set(`src/content/articles/${contentFile}`, content.endsWith('\n') ? content : `${content}\n`);
  files.set('src/content/articles/metadata.ts',
    "import type { Article } from '../../types';\n\n"
    + "export type ArticleMetadata = Omit<Article, 'content'> & { contentFile: string };\n\n"
    + `export const ARTICLES_METADATA: ArticleMetadata[] = ${JSON.stringify(entries, null, 2)};\n`);
  return { files, articleId: article.id, slug: article.slug, replacing: Boolean(previous) };
}

export function writeArticleImport(plan: ImportPlan, root: string): void {
  // Validate every destination and collision before writing any files.
  const targets = [...plan.files].map(([relative, data]) => {
    const destination = path.resolve(root, relative);
    if (!destination.startsWith(path.resolve(root) + path.sep)) throw new Error('Destino fora do projeto.');
    if (fs.existsSync(destination) && (relative.startsWith('public/') || (!plan.replacing && relative.endsWith('.md')))) {
      if (!fs.readFileSync(destination).equals(Buffer.from(data))) throw new Error(`Arquivo existente com conteúdo diferente: ${relative}`);
    }
    return { destination, data };
  });
  for (const { destination, data } of targets) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, data);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.length !== 1 || args[0] === '--help') {
    console.log('Uso: npm run import:article -- "/caminho/artigo.ot-sec.json"');
    if (args[0] !== '--help') process.exitCode = 1;
    return;
  }
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const packet = JSON.parse(fs.readFileSync(path.resolve(args[0]), 'utf8'));
    const plan = planArticleImport(packet, ARTICLES_METADATA);
    writeArticleImport(plan, root);
    console.log(`${plan.replacing ? 'Atualizado' : 'Adicionado'}: ${plan.slug}`);
    for (const filename of plan.files.keys()) console.log(`  ${filename}`);
    console.log('Revise o git diff, execute npm run lint e npm run build e envie as alterações ao GitHub para publicar.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
