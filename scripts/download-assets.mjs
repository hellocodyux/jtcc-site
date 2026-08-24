#!/usr/bin/env node
/**
 * Pulls every remote image referenced in content.json into
 * src/assets/images/ so Astro can optimize them at build time.
 *
 *   npm run assets
 *
 * Files are named by their `key`, which is how Figure.astro finds
 * them. Once a file exists locally, it's used instead of the Wix URL.
 */
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(root, '..', 'src', 'content', 'content.json');
const outDir = path.join(root, '..', 'src', 'assets', 'images');

const content = JSON.parse(await readFile(contentPath, 'utf8'));

// Walk the content tree and collect anything with a key + remote.
const found = new Map();
(function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach(walk);
  if (typeof node.key === 'string' && typeof node.remote === 'string') {
    found.set(node.key, node.remote);
  }
  Object.values(node).forEach(walk);
})(content);

await mkdir(outDir, { recursive: true });

console.log(`Found ${found.size} image(s) in content.json\n`);

let ok = 0;
let skipped = 0;
let failed = 0;

for (const [key, url] of found) {
  const ext = (url.match(/\.(jpe?g|png|webp|avif)/i)?.[1] ?? 'jpg').toLowerCase();
  const dest = path.join(outDir, `${key}.${ext}`);

  try {
    await access(dest);
    console.log(`  =  ${key}.${ext} (already present)`);
    skipped++;
    continue;
  } catch {
    /* not downloaded yet */
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Wix's CDN rejects requests without a browser-like UA.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 1024) throw new Error(`suspiciously small (${buf.byteLength}b)`);

    await writeFile(dest, buf);
    console.log(`  ✓  ${key}.${ext}  (${(buf.byteLength / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.warn(`  ✗  ${key}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDownloaded ${ok}, skipped ${skipped}, failed ${failed}.`);
if (failed > 0) {
  console.log(
    'Failed images still render from their Wix URLs, so the site works either way.'
  );
}
