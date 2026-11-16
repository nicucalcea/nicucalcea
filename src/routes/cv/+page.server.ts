import * as cv from '#lib/server/cv.js';
import { missingFavicons } from '#lib/server/favicons.js';

export async function load() {
	const work = cv.work();
	const education = cv.education();

	return {
		work,
		education,
		missingFavicons: await missingFavicons(cv.faviconSources(work, education))
	};
}
