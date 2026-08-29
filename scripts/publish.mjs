#!/usr/bin/env node
/**
 * One-command publish.
 *
 *   npm run publish "what changed"
 *
 * Builds first so a broken site never reaches GitHub, then commits
 * and pushes. Vercel picks it up automatically.
 */
import { execSync } from 'node:child_process';

const run = (cmd, opts = {}) =>
  execSync(cmd, { stdio: 'inherit', ...opts });

const quiet = (cmd) =>
  execSync(cmd, { encoding: 'utf8' }).trim();

const message = process.argv.slice(2).join(' ') || 'Site update';

try {
  const changes = quiet('git status --porcelain');
  if (!changes) {
    console.log('\nNothing has changed — nothing to publish.\n');
    process.exit(0);
  }

  console.log('\nChecking the site builds...\n');
  run('npm run build');

  console.log('\nBuild is good. Publishing...\n');
  run('git add .');
  run(`git commit -m ${JSON.stringify(message)}`);
  run('git push');

  console.log('\n✅ Published. Live in about a minute.');
  console.log('   Watch: vercel.com → jtcc-site → Deployments\n');
} catch {
  console.error('\n❌ Stopped — nothing was published.');
  console.error('   The build failed, so the live site is untouched.');
  console.error('   Scroll up for the error, or ask for help.\n');
  process.exit(1);
}
