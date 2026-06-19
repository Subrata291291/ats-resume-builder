import fs from "fs";
import { PNG } from "pngjs";

const width = 1200;
const height = 630;
const png = new PNG({ width, height });

function fillColor(x, y, r, g, b, a = 255) {
  const idx = (width * y + x) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    // gradient background from navy to indigo
    const t = y / (height - 1);
    const r = Math.round(28 + 30 * t);
    const g = Math.round(47 + 70 * t);
    const b = Math.round(82 + 113 * t);
    fillColor(x, y, r, g, b);
  }
}

// Draw a soft card area and heading block.
const cardPadding = 120;
for (let y = cardPadding; y < height - cardPadding; y++) {
  for (let x = cardPadding; x < width - cardPadding; x++) {
    const baseIdx = (width * y + x) << 2;
    const alpha = 0.14;
    png.data[baseIdx] = Math.round(png.data[baseIdx] * (1 - alpha) + 250 * alpha);
    png.data[baseIdx + 1] = Math.round(png.data[baseIdx + 1] * (1 - alpha) + 250 * alpha);
    png.data[baseIdx + 2] = Math.round(png.data[baseIdx + 2] * (1 - alpha) + 255 * alpha);
  }
}

// Add a small accent line.
const lineY = cardPadding + 70;
for (let x = cardPadding + 40; x < width - cardPadding - 40; x++) {
  for (let dy = 0; dy < 8; dy++) {
    if (lineY + dy < height) fillColor(x, lineY + dy, 99, 102, 241, 255);
  }
}

// Add text-like boxes.
const boxWidth = 520;
const boxHeight = 38;
const startX = cardPadding + 40;
let startY = cardPadding + 20;
const textBoxes = 4;
for (let i = 0; i < textBoxes; i++) {
  for (let y = startY + i * 60; y < startY + i * 60 + boxHeight; y++) {
    for (let x = startX; x < startX + boxWidth; x++) {
      const baseIdx = (width * y + x) << 2;
      png.data[baseIdx] = Math.round(png.data[baseIdx] * 0.85 + 255 * 0.15);
      png.data[baseIdx + 1] = Math.round(png.data[baseIdx + 1] * 0.85 + 255 * 0.15);
      png.data[baseIdx + 2] = Math.round(png.data[baseIdx + 2] * 0.85 + 255 * 0.15);
    }
  }
}

png.pack().pipe(fs.createWriteStream("./public/og-image.png")).on("finish", () => {
  console.log("Created public/og-image.png");
});
