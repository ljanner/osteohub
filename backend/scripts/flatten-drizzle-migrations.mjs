/**
 * Flattens the Drizzle migration structure by creating symlinks for each migration.sql file in drizzle-flat.
 * This is required because Drizzle 1.0.0-beta.1+ creates a nested folder structure for migrations,
 * which is not compatible with Wrangler's D1 migration system.
 *
 * Additional context: https://github.com/drizzle-team/drizzle-orm/issues/5266
 *
 * Note: This script should be run after generating migrations with drizzle-kit and before applying them with Wrangler.
 */

import { existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { join, relative } from 'node:path';

const drizzleDir = join(process.cwd(), 'drizzle');
const flatDir = join(process.cwd(), 'drizzle-flat');

if (!existsSync(drizzleDir)) {
  console.log('No drizzle directory found, skipping flatten step.');
  process.exit(0);
}

rmSync(flatDir, { recursive: true, force: true });
mkdirSync(flatDir, { recursive: true });

const folderMigrations = readdirSync(drizzleDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

let createdCount = 0;

for (const migrationFolder of folderMigrations) {
  const source = join(drizzleDir, migrationFolder, 'migration.sql');
  const target = join(flatDir, `${migrationFolder}.sql`);

  if (!existsSync(source)) {
    continue;
  }

  const targetRelativeToFlatDir = relative(flatDir, source);
  symlinkSync(targetRelativeToFlatDir, target);
  createdCount += 1;
}

console.log(`Created ${createdCount} symlinked migration file(s) in drizzle-flat.`);
