import fs from 'node:fs';
import sharp from 'sharp';

// Reuse the existing institutional mark and palette; no homepage layout changes.
const mark = await sharp('favicon.svg').resize(260, 260).png().toBuffer();
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#050505"/>
  <rect x="32" y="32" width="1136" height="566" rx="20" fill="none" stroke="#1e293b" stroke-width="2"/>
  <text x="400" y="280" font-family="sans-serif" font-size="92" font-weight="bold" fill="#ffffff">OT-SEC<tspan fill="#06b6d4">.</tspan></text>
  <text x="404" y="342" font-family="sans-serif" font-size="32" fill="#22d3ee">Technical Knowledge</text>
  <text x="404" y="399" font-family="sans-serif" font-size="23" fill="#9ca3af">OT/ICS Cybersecurity</text>
  <text x="404" y="436" font-family="sans-serif" font-size="23" fill="#9ca3af">Critical Electric Power Infrastructure</text>
  <text x="64" y="555" font-family="sans-serif" font-size="22" fill="#6b7280">ot-sec.blog.br</text>
</svg>`);
fs.mkdirSync('public/images', { recursive: true });
await sharp(text).composite([{ input: mark, left: 90, top: 185 }])
  .png().toFile('public/images/ot-sec-social.png');
console.log('[Social] Generated institutional sharing image (1200 x 630).');
