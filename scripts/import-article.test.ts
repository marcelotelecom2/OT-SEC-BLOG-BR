import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { transformSync } from 'esbuild';
import { planArticleImport, writeArticleImport } from './import-article';
import { serializeArticleExport } from '../src/lib/articleExport';
import { ARTICLES_METADATA, type ArticleMetadata } from '../src/content/articles/metadata';
import type { Article } from '../src/types';

const article: Article = {
  id: '123456', slug: 'novo-artigo-ot', title: 'Novo artigo OT', summary: 'Resumo do artigo.',
  content: '# Pesquisa\n\nConteúdo técnico.', area: 'OT', readTime: '5 min', date: '2026-10-18',
  published: true, author: 'Walter Rodrigues', tags: ['ICS'], views: 80,
};
const packet = (changes: Partial<Article> = {}) => JSON.parse(serializeArticleExport({ ...article, ...changes }));
const metadataOf = (plan: ReturnType<typeof planArticleImport>): ArticleMetadata[] => {
  const source = String(plan.files.get('src/content/articles/metadata.ts'));
  // Check that generated TypeScript compiles and parse its JSON array without executing it.
  transformSync(source, { loader: 'ts' });
  return JSON.parse(source.slice(source.indexOf(' = [') + 3).trim().replace(/;$/, ''));
};

test('an exported article becomes Markdown and metadata without changing other entries', () => {
  const before = structuredClone(ARTICLES_METADATA);
  const plan = planArticleImport(packet(), ARTICLES_METADATA);
  const entries = metadataOf(plan);
  assert.equal(plan.files.get('src/content/articles/novo-artigo-ot.md'), `${article.content}\n`);
  assert.equal(entries[0].author, article.author);
  assert.deepEqual(entries[0].tags, article.tags);
  assert.equal(entries[0].views, 0);
  assert.equal('content' in entries[0], false);
  assert.deepEqual(entries.slice(1), before);
  assert.deepEqual(ARTICLES_METADATA, before);
});

test('updating an article preserves its identity, position and original Markdown filename', () => {
  const original = ARTICLES_METADATA[0];
  const plan = planArticleImport(packet({ id: original.id, slug: 'slug-atualizado' }), ARTICLES_METADATA);
  const entries = metadataOf(plan);
  assert.equal(plan.replacing, true);
  assert.equal(entries.length, ARTICLES_METADATA.length);
  assert.equal(entries[0].contentFile, original.contentFile);
  assert.equal(entries[0].slug, 'slug-atualizado');
  assert.ok(plan.files.has(`src/content/articles/${original.contentFile}`));
});

test('cover and inline uploads become permanent image files and use the same path for identical data', () => {
  const bytes = Buffer.from('image fixture');
  const data = `data:image/png;base64,${bytes.toString('base64')}`;
  const plan = planArticleImport(packet({ coverImage: data, content: `![Diagrama](${data})` }), []);
  const images = [...plan.files.keys()].filter(file => file.startsWith('public/'));
  assert.equal(images.length, 1);
  assert.deepEqual(plan.files.get(images[0]), bytes);
  const publicPath = images[0].replace(/^public/, '');
  assert.equal(metadataOf(plan)[0].coverImage, publicPath);
  assert.equal(plan.files.get('src/content/articles/novo-artigo-ot.md'), `![Diagrama](${publicPath})\n`);
});

test('drafts, duplicate slugs, unsafe filenames and temporary image URLs fail before writing', () => {
  assert.throws(() => planArticleImport(packet({ published: false }), []), /rascunho/);
  assert.throws(() => planArticleImport(packet({ slug: ARTICLES_METADATA[0].slug }), ARTICLES_METADATA), /Slug/);
  assert.throws(() => planArticleImport(packet({ content: '![Diagrama](blob:temporary)' }), []), /temporária/);
  assert.throws(() => planArticleImport(packet(), [{ ...article, contentFile: '../outside.md' }]), /arquivo/);
});

test('import writes reviewable source files and refuses to overwrite an unrelated Markdown file', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-sec-import-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const plan = planArticleImport(packet(), []);
  writeArticleImport(plan, root);
  const markdown = path.join(root, 'src/content/articles/novo-artigo-ot.md');
  const metadata = path.join(root, 'src/content/articles/metadata.ts');
  assert.equal(fs.readFileSync(markdown, 'utf8'), `${article.content}\n`);
  const previousMetadata = fs.readFileSync(metadata, 'utf8');
  fs.writeFileSync(markdown, 'Unrelated content');
  assert.throws(() => writeArticleImport(plan, root), /Arquivo existente/);
  assert.equal(fs.readFileSync(markdown, 'utf8'), 'Unrelated content');
  assert.equal(fs.readFileSync(metadata, 'utf8'), previousMetadata);
});

test('every registered article has a Markdown body and a unique content filename', () => {
  const root = path.resolve('src/content/articles');
  assert.ok(ARTICLES_METADATA.length > 0);
  assert.equal(new Set(ARTICLES_METADATA.map(entry => entry.contentFile)).size, ARTICLES_METADATA.length);
  for (const entry of ARTICLES_METADATA) {
    assert.ok(fs.readFileSync(path.join(root, entry.contentFile), 'utf8').trim().length > 100);
  }
});

test('the CLI imports and reimports an export with spaces in its path without duplicating articles', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-sec-cli-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
  for (const relative of [
    'scripts/import-article.ts', 'src/lib/articleExport.ts', 'src/lib/sanitizeUrl.ts',
    'src/types.ts', 'src/content/articles/metadata.ts',
  ]) {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.resolve(relative), destination);
  }
  const input = path.join(root, 'artigo com espacos.ot-sec.json');
  fs.writeFileSync(input, serializeArticleExport(article));
  const cli = createRequire(import.meta.url).resolve('tsx/cli');
  const args = [cli, path.join(root, 'scripts/import-article.ts'), input];
  const first = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  assert.equal(first.status, 0, first.stderr);
  assert.match(first.stdout, /Adicionado/);
  const second = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, /Atualizado/);
  const result = fs.readFileSync(path.join(root, 'src/content/articles/metadata.ts'), 'utf8');
  assert.equal((result.match(/"id": "123456"/g) ?? []).length, 1);
});
