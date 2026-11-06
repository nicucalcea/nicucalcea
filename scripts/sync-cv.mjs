// Copies the shared portfolio data from samizdata-co/brand (data/cv.json) into
// src/data/cv.json, which is git-ignored. Edit the data in brand, not here.
//
// Looks for brand in $SAMIZDATA_BRAND_DIR, then .brand/ (the CI checkout),
// then the sibling checkout at ../samizdata/brand.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, 'src/data/cv.json');
const candidates = [
	process.env.SAMIZDATA_BRAND_DIR,
	resolve(root, '.brand'),
	resolve(root, '../samizdata/brand')
].filter(Boolean);

const source = candidates.map((dir) => resolve(dir, 'data/cv.json')).find(existsSync);

if (!source) {
	console.error(
		`sync-cv: data/cv.json not found in any of:\n  ${candidates.join('\n  ')}\n` +
			'Clone https://github.com/samizdata-co/brand next to this repo or set SAMIZDATA_BRAND_DIR.'
	);
	process.exit(1);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
console.log(`sync-cv: ${source} -> src/data/cv.json`);
