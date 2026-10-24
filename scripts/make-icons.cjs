// Builds assets/icon-only.png, icon-foreground.png, icon-background.png from icon.svg
// so @capacitor/assets can generate every Android launcher icon.
const fs = require('fs');
const sharp = require('sharp');

const svg = fs.readFileSync('icon.svg', 'utf8');
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const defs = (inner.match(/<defs>[\s\S]*?<\/defs>/) || [''])[0];
// motif = everything except <defs> and the rounded background rect
const motif = inner.replace(defs, '').replace(/<rect[^>]*fill="url\(#bg\)"[^>]*\/>/, '');

const wrap = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${defs}${body}</svg>`;

(async () => {
  fs.mkdirSync('assets', { recursive: true });
  // full icon (used for legacy/round launcher icons)
  await sharp(Buffer.from(svg), { density: 600 }).resize(1024, 1024).png().toFile('assets/icon-only.png');
  // adaptive background: gradient, square, no rounded corners
  await sharp(Buffer.from(wrap('<rect width="512" height="512" fill="url(#bg)"/>')), { density: 600 })
    .resize(1024, 1024).png().toFile('assets/icon-background.png');
  // adaptive foreground: motif only, scaled into Android's safe zone (centre ~66%)
  const s = 0.8, t = 256 * (1 - s);
  await sharp(Buffer.from(wrap(`<g transform="translate(${t} ${t}) scale(${s})">${motif}</g>`)), { density: 600 })
    .resize(1024, 1024).png().toFile('assets/icon-foreground.png');
  console.log('icons ready');
})();
