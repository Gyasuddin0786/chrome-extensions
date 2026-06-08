import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons')
fs.mkdirSync(ICONS_DIR, { recursive: true })

const SVG = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <text x="50%" y="54%" font-size="${Math.round(size * 0.5)}" font-family="system-ui" fill="white" text-anchor="middle" dominant-baseline="middle">&#x26A1;</text>
</svg>`

for (const size of [16, 32, 48, 128]) {
  fs.writeFileSync(path.join(ICONS_DIR, `icon${size}.svg`), SVG(size))
  console.log(`✓ icon${size}.svg`)
}

console.log('\nDone. Convert SVGs to PNGs for production use.')
