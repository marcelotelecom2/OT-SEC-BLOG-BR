import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/images/articles');
const widths = [480, 960, 1600];
const generatedPattern = /\.\d+w\.webp$/;

async function main() {
  if (!fs.existsSync(root)) return;
  const sources = fs.readdirSync(root)
    .filter(name => /\.(?:jpe?g|png|webp)$/i.test(name) && !generatedPattern.test(name));
  let written = 0;
  for (const name of sources) {
    const input = path.join(root, name);
    const stem = name.replace(/\.[^.]+$/, '');
    for (const width of widths) {
      const output = path.join(root, `${stem}.${width}w.webp`);
      await sharp(input)
        .rotate()
        .resize({ width })
        .webp({ quality: 76, effort: 5 })
        .toFile(output);
      written++;
    }
  }
  console.log(`[Images] Generated ${written} responsive WebP variants from ${sources.length} source images.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
