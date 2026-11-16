import * as cv from '#lib/server/cv.js';
import { missingFavicons } from '#lib/server/favicons.js';

export async function load() {
	const publications = cv.publications({ featured: true });
	const work = cv.work({ featured: true });
	const education = cv.education({ featured: true });
	const projects = cv.projects();

	return {
		basics: cv.basics(),
		publications,
		work,
		education,
		projects,
		missingFavicons: await missingFavicons(cv.faviconSources(publications, work, education, projects))
	};
}
