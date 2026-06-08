import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')

// 1. Copy manifest.json
fs.copyFileSync(path.join(root, 'manifest.json'), path.join(dist, 'manifest.json'))
console.log('✓ manifest.json copied')

// 2. Copy icons
const iconsDir = path.join(dist, 'icons')
fs.mkdirSync(iconsDir, { recursive: true })
const srcIcons = path.join(root, 'assets', 'icons')
for (const f of fs.readdirSync(srcIcons)) {
  if (f.endsWith('.png')) {
    fs.copyFileSync(path.join(srcIcons, f), path.join(iconsDir, f))
  }
}
console.log('✓ icons copied')

// 3. Move HTML files from nested paths to dist root and fix asset paths
const htmlMap = {
  'src/popup/index.html': 'popup.html',
  'src/dashboard/index.html': 'dashboard.html',
  'src/options/index.html': 'options.html',
  'src/welcome/index.html': 'welcome.html',
}

for (const [nested, flat] of Object.entries(htmlMap)) {
  const src = path.join(dist, nested)
  const dest = path.join(dist, flat)
  if (fs.existsSync(src)) {
    let html = fs.readFileSync(src, 'utf8')
    // Fix all relative paths that go up directories (../../assets/) to flat (assets/)
    html = html.replace(/src="\.\.\/\.\.\/assets\//g, 'src="assets/')
    html = html.replace(/href="\.\.\/\.\.\/assets\//g, 'href="assets/')
    html = html.replace(/src="\.\.\/assets\//g, 'src="assets/')
    html = html.replace(/href="\.\.\/assets\//g, 'href="assets/')
    // Also fix absolute paths just in case
    html = html.replace(/src="\/assets\//g, 'src="assets/')
    html = html.replace(/href="\/assets\//g, 'href="assets/')
    fs.writeFileSync(dest, html)
    console.log(`✓ ${nested} → ${flat}`)
  } else {
    console.warn(`⚠ Not found: ${src}`)
  }
}

// 4. Remove nested src/ dir
fs.rmSync(path.join(dist, 'src'), { recursive: true, force: true })
console.log('✓ cleaned up nested src/ dir')

console.log('\n✅ Extension ready in dist/')
