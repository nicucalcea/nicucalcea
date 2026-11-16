import * as cv from '#lib/server/cv.js';
import { missingFavicons } from '#lib/server/favicons.js';

export async function load() {
	const publications = cv.publications();

	return {
		publications,
		missingFavicons: await missingFavicons(cv.faviconSources(publications))
	};
}
