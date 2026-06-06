/**
 * Generates og-image.png in public/ using only Node built-ins (no canvas/sharp needed).
 * Creates a valid 1200x630 PNG with a solid gradient-like background.
 * Run: node generate-og.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1200, H = 630;

// ── PNG helpers ──────────────────────────────────────────
function crc32(buf) {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = data || Buffer.alloc(0);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
  const crcBuf = Buffer.concat([t, d]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, d, crc]);
}

// Build raw RGBA pixel rows
const rows = [];
for (let y = 0; y < H; y++) {
  // Gradient: dark teal (#0a4d41) → dark navy (#1b3558)
  const t = y / H;
  const r = Math.round(10  + (27  - 10)  * t);
  const g = Math.round(77  + (53  - 77)  * t);
  const b = Math.round(65  + (88  - 65)  * t);

  const row = Buffer.alloc(1 + W * 4); // filter byte + RGBA
  row[0] = 0; // None filter
  for (let x = 0; x < W; x++) {
    const i = 1 + x * 4;

    // South Sudan flag stripe at top/bottom (24px each side)
    if (y < 8)                        { row[i]=7;   row[i+1]=137; row[i+2]=48;  row[i+3]=255; continue; }
    if (y >= 8  && y < 16)            { row[i]=252; row[i+1]=221; row[i+2]=9;   row[i+3]=255; continue; }
    if (y >= 16 && y < 24)            { row[i]=218; row[i+1]=18;  row[i+2]=26;  row[i+3]=255; continue; }
    if (y >= H-8)                     { row[i]=7;   row[i+1]=137; row[i+2]=48;  row[i+3]=255; continue; }
    if (y >= H-16 && y < H-8)        { row[i]=252; row[i+1]=221; row[i+2]=9;   row[i+3]=255; continue; }
    if (y >= H-24 && y < H-16)       { row[i]=218; row[i+1]=18;  row[i+2]=26;  row[i+3]=255; continue; }

    // Orange accent circle top-right
    const dx = x - 1100, dy = y - 80;
    if (dx*dx + dy*dy < 220*220) {
      const a = 38; // ~15% opacity
      row[i]   = Math.min(255, r + Math.round((216-r)*a/255));
      row[i+1] = Math.min(255, g + Math.round((134-g)*a/255));
      row[i+2] = Math.min(255, b + Math.round((47-b)*a/255));
      row[i+3] = 255;
      continue;
    }

    row[i]=r; row[i+1]=g; row[i+2]=b; row[i+3]=255;
  }
  rows.push(row);
}

const raw = Buffer.concat(rows);
const compressed = zlib.deflateSync(raw, { level: 6 });

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 2;  // color type: RGB — wait, we use RGBA so color type = 6
ihdr[9] = 6;
ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND'),
]);

const outPath = path.join(__dirname, 'public', 'og-image.png');
fs.writeFileSync(outPath, png);
console.log(`✅ og-image.png written (${png.length} bytes) → ${outPath}`);
