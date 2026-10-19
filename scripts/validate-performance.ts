import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

assert.ok(existsSync(dist), 'dist/ não existe; execute npm run build antes da validação.');

const headers = readFileSync(join(dist, '_headers'), 'utf8');
assert.match(headers, /\/assets\/\*[\s\S]*max-age=31536000, immutable/);
assert.match(headers, /\/images\/articles\/\*[\s\S]*stale-while-revalidate=86400/);
assert.match(headers, /\/admin[\s\S]*Cache-Control: no-store/);

const assetFiles = readdirSync(join(dist, 'assets'));
const entryAssets = assetFiles.filter((file) => /\.(js|css)$/.test(file));
assert.ok(entryAssets.length > 0, 'Nenhum bundle JS/CSS foi gerado.');
for (const file of entryAssets) {
  assert.match(file, /-[A-Za-z0-9_-]{8,}\.(js|css)$/, `Asset sem hash: ${file}`);
}

const imagesDir = join(dist, 'images', 'articles');
const sourceImages = readdirSync(imagesDir).filter((file) => /\.(png|jpe?g)$/i.test(file));
for (const source of sourceImages) {
  const stem = source.replace(/\.[^.]+$/, '');
  for (const width of [480, 960, 1600]) {
    const variant = join(imagesDir, `${stem}.${width}w.webp`);
    assert.ok(existsSync(variant), `Variante responsiva ausente: ${variant}`);
  }
}

const articleRoot = join(dist, 'en', 'articles');
const articleFile = readdirSync(articleRoot).find((name) =>
  name.endsWith('.html') && statSync(join(articleRoot, name)).isFile(),
);
assert.ok(articleFile, 'Nenhum artigo em inglês foi pré-renderizado.');
const articleHtml = readFileSync(join(articleRoot, articleFile), 'utf8');
assert.match(articleHtml, /<article[\s>]/, 'O HTML do artigo não contém o conteúdo pré-renderizado.');
assert.match(articleHtml, /srcset=/i, 'O artigo não contém imagens responsivas.');
assert.match(articleHtml, /width="\d+"/i, 'A imagem principal não declara largura.');
assert.match(articleHtml, /height="\d+"/i, 'A imagem principal não declara altura.');

console.log(`Performance estática validada: ${entryAssets.length} assets com hash, ${sourceImages.length} imagens com variantes e cache configurado.`);
