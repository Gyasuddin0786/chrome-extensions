/**
 * Pure Node.js PNG icon generator — no extra deps.
 * Creates gradient icons with a lightning bolt ⚡ shape.
 * Run: node scripts/make-icons.mjs
 */
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'assets', 'icons')
fs.mkdirSync(OUT, { recursive: true })

// ── PNG helpers ──────────────────────────────────────────────────────────────

function u32(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n, 0)
  return b
}

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) {
    c ^= byte
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = u32(data.length)
  const crcBuf = Buffer.concat([t, data])
  return Buffer.concat([len, t, data, u32(crc32(crcBuf))])
}

function makePNG(size, pixelFn) {
  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)   // width
  ihdrData.writeUInt32BE(size, 4)   // height
  ihdrData[8] = 8                   // bit depth
  ihdrData[9] = 2                   // color type: RGB
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0

  // Raw pixel data — filter byte 0 per row
  const raw = Buffer.alloc(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0 // filter type None
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixelFn(x, y, size)
      const off = y * (1 + size * 3) + 1 + x * 3
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 })

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Draw icon ────────────────────────────────────────────────────────────────

function lerp(a, b, t) { return Math.round(a + (b - a) * t) }

function drawIcon(x, y, size) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2

  const dx = x - cx
  const dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)

  // Rounded square mask (like app icon)
  const radius = size * 0.22
  const rx = Math.abs(dx) - (r - radius)
  const ry = Math.abs(dy) - (r - radius)
  const cornerDist = Math.sqrt(Math.max(0, rx) ** 2 + Math.max(0, ry) ** 2)
  const inside = rx <= 0 && ry <= 0
    ? true
    : cornerDist <= radius

  if (!inside) return [245, 245, 250] // outside — white bg

  // Gradient: top-left #6366f1 → bottom-right #8b5cf6
  const t = (x + y) / (size * 2)
  const bg = [
    lerp(0x63, 0x8b, t),
    lerp(0x66, 0x5c, t),
    lerp(0xf1, 0xf6, t),
  ]

  // Lightning bolt shape (⚡)
  // Bolt defined as a simple polygon, normalized 0..1
  const bx = (x / size - 0.5) * 1.6 + 0.5
  const by = (y / size - 0.5) * 1.6 + 0.5

  // Top triangle of bolt: right side going down-left
  // Bottom triangle: left side going down-right
  const inBolt = (
    // Upper part of bolt (top-right to middle-left)
    (bx > 0.42 && bx < 0.82 && by > 0.08 && by < 0.55 && bx + by < 1.18 && bx - by > -0.1) ||
    // Lower part of bolt (middle-right to bottom-left)
    (bx > 0.18 && bx < 0.60 && by > 0.45 && by < 0.92 && bx + by > 0.82 && by - bx > -0.05)
  )

  if (inBolt) return [255, 255, 255] // white bolt

  return bg
}

// ── Generate all sizes ────────────────────────────────────────────────────────

for (const size of [16, 32, 48, 128]) {
  const png = makePNG(size, (x, y) => drawIcon(x, y, size))
  const outPath = path.join(OUT, `icon${size}.png`)
  fs.writeFileSync(outPath, png)
  console.log(`✓ icon${size}.png  (${png.length} bytes)`)
}

console.log('\n✅ Icons generated in assets/icons/')
