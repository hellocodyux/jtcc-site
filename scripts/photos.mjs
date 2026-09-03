#!/usr/bin/env node
/**
 * npm run photos
 *
 * First-pass photo triage. Scans a folder, scores every image on
 * technical quality, and copies the strongest into a shortlist
 * folder ready to review.
 *
 * This judges resolution, sharpness, exposure, and shape — NOT
 * whether the food looks good. It narrows the pile so a human only
 * has to make the interesting decisions.
 *
 *   Input:  ~/Desktop/jtcc-photos
 *   Output: ~/Desktop/jtcc-photos-shortlist
 */
import { readdirSync, mkdirSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { homedir } from 'node:os';
import sharp from 'sharp';

const IN = join(homedir(), 'Desktop', 'jtcc-photos');
const OUT = join(homedir(), 'Desktop', 'jtcc-photos-shortlist');
const KEEP = 40;
const OK = ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'];

if (!existsSync(IN)) {
  console.error(`\n❌ No folder found at:\n   ${IN}\n`);
  console.error('   Make a folder called "jtcc-photos" on your Desktop and put the photos in it.\n');
  process.exit(1);
}

const files = readdirSync(IN).filter((f) => OK.includes(extname(f).toLowerCase()));
const heic = readdirSync(IN).filter((f) => extname(f).toLowerCase() === '.heic');

if (heic.length > 0) {
  console.log(`\n⚠️  Skipping ${heic.length} HEIC file(s) — that format can't be read here.`);
  console.log('   In Photos: select them, File → Export → Export Photos, choose JPEG.\n');
}

if (files.length === 0) {
  console.error(`\n❌ No readable photos in ${IN}\n`);
  process.exit(1);
}

console.log(`\nAnalyzing ${files.length} photos...\n`);

const scored = [];
let failed = 0;
let tooSmall = 0;

for (const file of files) {
  const path = join(IN, file);
  try {
    const img = sharp(path);
    const meta = await img.metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    if (!width || !height) throw new Error('no dimensions');

    // Stats on a downscaled greyscale copy — fast and good enough.
    const stats = await sharp(path).greyscale().resize(400, 400, { fit: 'inside' }).stats();
    const ch = stats.channels[0];
    const contrast = ch.stdev;      // proxy for sharpness/detail
    const brightness = ch.mean;     // 0–255

    const megapixels = (width * height) / 1_000_000;
    const ratio = width / height;

    // Hard floor — below this it can't be used full-width on a
    // retina screen, however good the picture is.
    if (megapixels < 1.2) { tooSmall++; continue; }

    // --- Scoring ---
    let score = 0;

    // Resolution — needs to hold up full-width on a retina screen
    if (megapixels >= 6) score += 30;
    else if (megapixels >= 3) score += 22;
    else if (megapixels >= 1.5) score += 12;
    else score += 2;

    // Detail / sharpness. Flat or blurry images score low.
    if (contrast >= 60) score += 30;
    else if (contrast >= 48) score += 24;
    else if (contrast >= 38) score += 16;
    else if (contrast >= 28) score += 8;

    // Exposure — penalise very dark and blown out
    if (brightness >= 95 && brightness <= 175) score += 25;
    else if (brightness >= 80 && brightness <= 195) score += 16;
    else if (brightness >= 65 && brightness <= 210) score += 8;

    // Shape — landscape is most useful for a website
    let shape;
    if (ratio >= 1.5) { shape = 'wide';      score += 15; }
    else if (ratio >= 1.2) { shape = 'landscape'; score += 13; }
    else if (ratio >= 0.9) { shape = 'square';    score += 9; }
    else if (ratio >= 0.7) { shape = 'portrait';  score += 8; }
    else { shape = 'tall'; score += 4; }

    // Flag hero candidates: wide, well exposed, high resolution
    const heroish = ratio >= 1.4 && megapixels >= 5 && brightness >= 90 && brightness <= 180;

    scored.push({ file, path, score, megapixels, contrast, brightness, shape, ratio, heroish });
  } catch {
    failed++;
  }
}

scored.sort((a, b) => b.score - a.score);
const shortlist = scored.slice(0, KEEP);

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

shortlist.forEach((p, i) => {
  const n = String(i + 1).padStart(2, '0');
  const tag = p.heroish ? 'HERO' : p.shape.toUpperCase();
  copyFileSync(p.path, join(OUT, `${n}_${tag}_${basename(p.file)}`));
});

console.log('Top candidates:\n');
console.log('  #   score  size    shape      notes');
console.log('  ─────────────────────────────────────────────');
shortlist.slice(0, 15).forEach((p, i) => {
  const n = String(i + 1).padStart(2, ' ');
  console.log(
    `  ${n}   ${String(p.score).padStart(3)}   ${p.megapixels.toFixed(1)}MP  ${p.shape.padEnd(9)}  ${p.heroish ? '← hero candidate' : ''}`
  );
});

const heroCount = shortlist.filter((p) => p.heroish).length;

console.log(`\n✅ Copied the top ${shortlist.length} to:`);
console.log(`   ${OUT}\n`);
console.log(`   ${heroCount} marked as hero candidates (wide and bright).`);
if (tooSmall) console.log(`   ${tooSmall} skipped as too low-resolution for web use.`);
if (failed) console.log(`   ${failed} file(s) couldn't be read and were skipped.`);
console.log('\nOpen that folder, delete any you don\'t like the look of,');
console.log('then upload what\'s left to the chat.\n');
console.log('Note: this only judged technical quality — resolution, sharpness,');
console.log('exposure, shape. It has no idea whether the food looks good.\n');
