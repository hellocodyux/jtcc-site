#!/usr/bin/env node
/**
 * npm run polish
 *
 * Takes photos from ~/Desktop/jtcc-chosen, applies one consistent
 * treatment to all of them, crops each to the shape its job needs,
 * and writes them into the site.
 *
 * The point is cohesion. Photos shot on different days in different
 * light look like a jumble unless something pulls them together —
 * this nudges everything toward the same warmth, contrast and
 * saturation so they read as one body of work.
 *
 * Name files by job before running:
 *
 *   hero.jpg               → 16:9,  full-bleed hero
 *   break-*.jpg            → 16:7,  full-width bands between sections
 *   about.jpg              → 4:5,   About page portrait
 *   service-*.jpg          → 3:2,   one per offering
 *   gallery-*.jpg          → 4:5,   Media page grid
 *
 * Anything else is treated as a gallery image.
 */
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { homedir } from 'node:os';
import sharp from 'sharp';

const IN = join(homedir(), 'Desktop', 'jtcc-chosen');
const OUT = join(process.cwd(), 'src', 'assets', 'images');
const OK = ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'];

if (!existsSync(IN)) {
  console.error(`\n❌ No folder at:\n   ${IN}\n`);
  console.error('   Make a folder called "jtcc-chosen" on your Desktop,');
  console.error('   put your chosen photos in it, and name them by job.\n');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const files = readdirSync(IN).filter((f) => OK.includes(extname(f).toLowerCase()));
const heic = readdirSync(IN).filter((f) => extname(f).toLowerCase() === '.heic');

if (heic.length) {
  console.log(`\n⚠️  Skipping ${heic.length} HEIC file(s) — can't be read.`);
  console.log('   In Photos: select, File → Export → Export Photos → JPEG.\n');
}

if (!files.length) {
  console.error(`\n❌ No readable photos in ${IN}\n`);
  process.exit(1);
}

/** Which shape each job needs, and where to bias the crop. */
function jobFor(name) {
  const n = basename(name, extname(name)).toLowerCase();
  if (n === 'hero') return { ratio: 16 / 9, width: 2400, focus: 0.5 };
  if (n.startsWith('break')) return { ratio: 16 / 7, width: 2400, focus: 0.45 };
  if (n === 'about') return { ratio: 4 / 5, width: 1400, focus: 0.4 };
  if (n.startsWith('service')) return { ratio: 3 / 2, width: 1600, focus: 0.5 };
  return { ratio: 4 / 5, width: 1400, focus: 0.45 };
}

console.log(`Processing ${files.length} photo(s)...\n`);

let done = 0;
let failed = 0;

for (const file of files) {
  const { ratio, width, focus } = jobFor(file);
  const outName = `${basename(file, extname(file))}.jpg`;

  try {
    const img = sharp(join(IN, file)).rotate(); // honour EXIF orientation
    const meta = await img.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    if (!w || !h) throw new Error('no dimensions');

    // Crop to the target shape, biased toward where the subject sits.
    let cropW = w;
    let cropH = Math.round(w / ratio);
    if (cropH > h) {
      cropH = h;
      cropW = Math.round(h * ratio);
    }
    const left = Math.round((w - cropW) * focus);
    const top = Math.round((h - cropH) * focus);

    await img
      .extract({ left, top, width: cropW, height: cropH })
      .resize({ width, withoutEnlargement: true })
      // One shared treatment — this is what makes them cohesive.
      .modulate({ saturation: 1.06, brightness: 1.03 })
      .linear(1.03, -4)
      .sharpen({ sigma: 0.6 })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(OUT, outName));

    console.log(`  ✓ ${outName.padEnd(28)} ${cropW}×${cropH} → ${width}px wide`);
    done++;
  } catch (err) {
    console.warn(`  ✗ ${file}: ${err.message}`);
    failed++;
  }
}

console.log(`\n✅ ${done} written to src/assets/images/`);
if (failed) console.log(`   ${failed} failed.`);
console.log('\nNext:  npm run dev   then   npm run publish "new photos"\n');
