// Generates app icons (no dependencies) — purple gradient with a white dumbbell.
// Run: node make-icons.js
const zlib = require("zlib");
const fs = require("fs");

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return (~c) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function png(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// 4-point sparkle: astroid star |u|^p + |v|^p <= 1 (cusps point along the axes).
function astroid(x, y, cx, cy, R, p) {
  const u = Math.abs(x - cx) / R, v = Math.abs(y - cy) / R;
  return Math.pow(u, p) + Math.pow(v, p) <= 1;
}
function inGlyph(x, y) { // coords in 0..512 space
  return astroid(x, y, 244, 262, 152, 0.6)   // main sparkle
    || astroid(x, y, 396, 138, 42, 0.6);      // small accent twinkle
}
function render(size) {
  const c1 = hex("#8b6cff"), c2 = hex("#5b3fd1"), white = [255, 255, 255];
  const buf = Buffer.alloc(size * size * 4);
  const S = 3;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = (x + y) / (2 * size);
      const bg = [Math.round(lerp(c1[0], c2[0], t)), Math.round(lerp(c1[1], c2[1], t)), Math.round(lerp(c1[2], c2[2], t))];
      let cov = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const px = (x + (sx + 0.5) / S) / size * 512, py = (y + (sy + 0.5) / S) / size * 512;
        if (inGlyph(px, py)) cov++;
      }
      cov /= S * S;
      const i = (y * size + x) * 4;
      buf[i] = Math.round(lerp(bg[0], white[0], cov));
      buf[i + 1] = Math.round(lerp(bg[1], white[1], cov));
      buf[i + 2] = Math.round(lerp(bg[2], white[2], cov));
      buf[i + 3] = 255;
    }
  }
  return png(size, buf);
}
fs.writeFileSync("icon-512.png", render(512));
fs.writeFileSync("icon-192.png", render(192));
fs.writeFileSync("apple-touch-icon.png", render(180));
console.log("icons written: icon-512.png, icon-192.png, apple-touch-icon.png");
