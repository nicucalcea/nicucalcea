// Copies the shared portfolio data from samizdata-co/brand (data/cv.json) into
// src/data/cv.json, which is git-ignored. Edit the data in brand, not here.
//
// Looks for a brand checkout in $SAMIZDATA_BRAND_DIR, then .brand/, then the
// sibling checkout at ../samizdata/brand. Without one (e.g. on a build
// server), downloads the file from the brand repository's main branch.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REMOTE = 'https://raw.githubusercontent.com/samizdata-co/brand/main/data/cv.json';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, 'src/data/cv.json');
const candidates = [
	process.env.SAMIZDATA_BRAND_DIR,
	resolve(root, '.brand'),
	resolve(root, '../samizdata/brand')
].filter(Boolean);

const source = candidates.map((dir) => resolve(dir, 'data/cv.json')).find(existsSync);

mkdirSync(dirname(destination), { recursive: true });

if (source) {
	copyFileSync(source, destination);
	console.log(`sync-cv: ${source} -> src/data/cv.json`);
} else {
	const response = await fetch(REMOTE, { signal: AbortSignal.timeout(30_000) });
	if (!response.ok) {
		console.error(`sync-cv: no local brand checkout, and ${REMOTE} returned ${response.status}`);
		process.exit(1);
	}
	const text = await response.text();
	JSON.parse(text); // fail the build on a truncated or invalid download
	writeFileSync(destination, text);
	console.log(`sync-cv: ${REMOTE} -> src/data/cv.json`);
}
