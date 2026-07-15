/**
 * Generates public/og-image.png — a rich 1200x630 image showing the South Sudan flag.
 * Uses only Node built-ins (no canvas/sharp needed).
 * Run: node generate-og.js
 */
const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1200, H = 630;

// ── CRC32 + PNG chunk helpers ───────────────────────────
const crcTable = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = data || Buffer.alloc(0);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
  const crcBuf = Buffer.concat([t, d]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, d, crc]);
}

// ── Pixel buffer: RGBA flat array ──────────────────────
const pixels = new Uint8Array(W * H * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = a;
}

function fillRect(x0, y0, w, h, r, g, b, a = 255) {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++)
      setPixel(x, y, r, g, b, a);
}

function blendPixel(x, y, r, g, b, alpha) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  const a = alpha / 255;
  pixels[i]   = Math.round(pixels[i]   * (1-a) + r * a);
  pixels[i+1] = Math.round(pixels[i+1] * (1-a) + g * a);
  pixels[i+2] = Math.round(pixels[i+2] * (1-a) + b * a);
  pixels[i+3] = 255;
}

function fillCircle(cx, cy, radius, r, g, b, a = 255) {
  for (let y = cy - radius; y <= cy + radius; y++)
    for (let x = cx - radius; x <= cx + radius; x++)
      if ((x-cx)*(x-cx) + (y-cy)*(y-cy) <= radius*radius)
        setPixel(x, y, r, g, b, a);
}

function fillTriangle(x0,y0, x1,y1, x2,y2, r,g,b) {
  const minX = Math.max(0, Math.min(x0,x1,x2));
  const maxX = Math.min(W-1, Math.max(x0,x1,x2));
  const minY = Math.max(0, Math.min(y0,y1,y2));
  const maxY = Math.min(H-1, Math.max(y0,y1,y2));
  function sign(px,py, ax,ay, bx,by) {
    return (px-bx)*(ay-by) - (ax-bx)*(py-by);
  }
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d1 = sign(x,y, x0,y0, x1,y1);
      const d2 = sign(x,y, x1,y1, x2,y2);
      const d3 = sign(x,y, x2,y2, x0,y0);
      const hasNeg = (d1<0)||(d2<0)||(d3<0);
      const hasPos = (d1>0)||(d2>0)||(d3>0);
      if (!(hasNeg && hasPos)) setPixel(x, y, r, g, b);
    }
  }
}

// ── Draw a 5-pointed star ───────────────────────────────
function fillStar(cx, cy, outerR, innerR, r, g, b) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI / 5) - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    pts.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  // Fill by scanline
  const minY = Math.max(0, Math.floor(Math.min(...pts.map(p=>p[1]))));
  const maxY = Math.min(H-1, Math.ceil(Math.max(...pts.map(p=>p[1]))));
  for (let y = minY; y <= maxY; y++) {
    const intersections = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax,ay] = pts[i];
      const [bx,by] = pts[(i+1) % pts.length];
      if ((ay <= y && by > y) || (by <= y && ay > y)) {
        intersections.push(ax + (y - ay) / (by - ay) * (bx - ax));
      }
    }
    intersections.sort((a,b) => a-b);
    for (let k = 0; k < intersections.length - 1; k += 2) {
      const x0 = Math.max(0, Math.ceil(intersections[k]));
      const x1 = Math.min(W-1, Math.floor(intersections[k+1]));
      for (let x = x0; x <= x1; x++) setPixel(x, y, r, g, b);
    }
  }
}

// ══════════════════════════════════════════════════════
// DRAW THE IMAGE
// ══════════════════════════════════════════════════════

// 1. Dark teal/navy gradient background
for (let y = 0; y < H; y++) {
  const t = y / H;
  const r = Math.round(10  + (27  - 10)  * t);
  const g = Math.round(77  + (53  - 77)  * t);
  const b = Math.round(65  + (88  - 65)  * t);
  fillRect(0, y, W, 1, r, g, b);
}

// 2. Flag stripe accents top (black/yellow/red — correct South Sudan order)
fillRect(0,  0, W, 12, 0,   0,   0);    // black
fillRect(0, 12, W, 12, 252, 221, 9);    // yellow
fillRect(0, 24, W, 12, 218, 18,  26);   // red
// Bottom stripes (same order top to bottom)
fillRect(0, H-36, W, 12, 0,   0,   0);
fillRect(0, H-24, W, 12, 252, 221, 9);
fillRect(0, H-12, W, 12, 218, 18,  26);

// 3. ── SOUTH SUDAN FLAG (right side) ─────────────────
// Flag at x=670, y=155, size=440x293 (3:2 ratio)
const FX = 670, FY = 155, FW = 440, FH = 293;

// Drop shadow
fillRect(FX+8, FY+8, FW, FH, 0, 0, 0, 80);

// Correct flag stripes: Black (top), White, Red (middle), White, Green (bottom)
// Black stripe (top third)
fillRect(FX, FY,          FW, Math.round(FH/3),     0,   0,   0);
// White separator
fillRect(FX, FY+Math.round(FH/3)-2, FW, 4,          255, 255, 255);
// Red stripe (middle)
fillRect(FX, FY+Math.round(FH/3),   FW, Math.round(FH/3),   218, 18,  26);
// White separator
fillRect(FX, FY+Math.round(FH*2/3)-2, FW, 4,        255, 255, 255);
// Green stripe (bottom)
fillRect(FX, FY+Math.round(FH*2/3), FW, FH-Math.round(FH*2/3), 7, 137, 48);

// Blue triangle (left side of flag)
fillTriangle(
  FX,      FY,
  FX+185,  FY + Math.round(FH/2),
  FX,      FY + FH,
  15, 71, 175   // #0F47AF
);

// Yellow star inside the triangle
fillStar(FX + 75, FY + Math.round(FH/2), 42, 18, 252, 221, 9);

// Flag border
for (let y = FY; y < FY+FH; y++) {
  setPixel(FX, y, 255, 255, 255, 100);
  setPixel(FX+FW-1, y, 255, 255, 255, 100);
}
for (let x = FX; x < FX+FW; x++) {
  setPixel(x, FY, 255, 255, 255, 100);
  setPixel(x, FY+FH-1, 255, 255, 255, 100);
}

// 4. White glow circle behind flag
for (let y = FY-20; y < FY+FH+20; y++) {
  for (let x = FX-20; x < FX+FW+20; x++) {
    const dx = x - (FX + FW/2), dy = y - (FY + FH/2);
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = Math.sqrt((FW/2+20)*(FW/2+20) + (FH/2+20)*(FH/2+20));
    if (dist < maxDist) {
      blendPixel(x, y, 255, 255, 255, Math.round(18 * (1 - dist/maxDist)));
    }
  }
}

// ══════════════════════════════════════════════════════
// Encode PNG
// ══════════════════════════════════════════════════════
const rows = [];
for (let y = 0; y < H; y++) {
  const row = Buffer.alloc(1 + W * 4);
  row[0] = 0; // None filter
  for (let x = 0; x < W; x++) {
    const src = (y * W + x) * 4;
    const dst = 1 + x * 4;
    row[dst]   = pixels[src];
    row[dst+1] = pixels[src+1];
    row[dst+2] = pixels[src+2];
    row[dst+3] = pixels[src+3];
  }
  rows.push(row);
}

const raw        = Buffer.concat(rows);
const compressed = zlib.deflateSync(raw, { level: 6 });

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // RGBA
ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', compressed),
  pngChunk('IEND'),
]);

const outPath = path.join(__dirname, 'public', 'og-image.png');
fs.writeFileSync(outPath, png);
// Also write as preview.png for cache-busted og:image URL
fs.writeFileSync(path.join(__dirname, 'public', 'preview.png'), png);
console.log(`✅ og-image.png + preview.png written (${(png.length/1024).toFixed(1)} KB)`);
