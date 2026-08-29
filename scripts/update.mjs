#!/usr/bin/env node
/**
 * npm run update
 *
 * Finds the most recently unzipped jtcc-site folder in ~/Downloads and
 * copies its source files into this project. Removes the guesswork
 * about folder names ("jtcc-site 2", "jtcc-site 7"...) that made manual
 * copying error-prone.
 *
 * Preserves the Instagram feed ID if the incoming content.json doesn't
 * have one, so an update never silently disconnects the feed.
 */
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const downloads = join(homedir(), 'Downloads');
const projectRoot = process.cwd();

// Candidate folders: anything starting jtcc-site that isn't a zip and
// actually looks like the project.
const candidates = readdirSync(downloads)
  .filter((name) => name.toLowerCase().startsWith('jtcc-site'))
  .filter((name) => !name.endsWith('.zip'))
  .map((name) => join(downloads, name))
  .filter((path) => {
    try {
      return statSync(path).isDirectory() && existsSync(join(path, 'src', 'content', 'content.json'));
    } catch {
      return false;
    }
  })
  .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

if (candidates.length === 0) {
  console.error('\n❌ No unzipped jtcc-site folder found in Downloads.');
  console.error('   Download the zip and double-click it first, then run this again.\n');
  process.exit(1);
}

const source = candidates[0];
console.log(`\nInstalling from: ${source}`);

// Keep the existing feed ID if the incoming file doesn't carry one.
const localContentPath = join(projectRoot, 'src', 'content', 'content.json');
let keepFeedId = '';
try {
  const local = JSON.parse(readFileSync(localContentPath, 'utf8'));
  keepFeedId = local?.instagram?.feedId ?? '';
} catch {
  /* first run, or no local file yet */
}

// Copy source files
for (const dir of ['src', 'scripts']) {
  const from = join(source, dir);
  if (existsSync(from)) {
    cpSync(from, join(projectRoot, dir), { recursive: true });
    console.log(`  ✓ ${dir}/`);
  }
}

for (const file of ['package.json', 'astro.config.mjs', 'EDITING.md', 'README.md', 'UPDATING.md']) {
  const from = join(source, file);
  if (existsSync(from)) {
    cpSync(from, join(projectRoot, file));
    console.log(`  ✓ ${file}`);
  }
}

// Restore feed ID if the update blanked it
if (keepFeedId) {
  try {
    const incoming = JSON.parse(readFileSync(localContentPath, 'utf8'));
    if (!incoming?.instagram?.feedId) {
      incoming.instagram.feedId = keepFeedId;
      writeFileSync(localContentPath, JSON.stringify(incoming, null, 2) + '\n');
      console.log(`  ✓ kept Instagram feed ID`);
    }
  } catch {
    /* leave it alone if anything looks off */
  }
}

console.log('\n✅ Updated. Next:');
console.log('   npm install      (only if package.json changed)');
console.log('   npm run dev      (preview)');
console.log('   npm run publish "what changed"\n');
