// Server-only access to the portfolio data. src/data/cv.json is ~500 KB, so
// pages load just the slices and fields they render instead of importing the
// whole file into the client bundle.
import cv from '#data/cv.json';

type Entry = Record<string, any>;

function pick<T extends Entry>(entry: T, keys: readonly string[]): Partial<T> {
	const out: Entry = {};
	for (const key of keys) {
		if (entry[key] !== undefined && entry[key] !== '') out[key] = entry[key];
	}
	return out as Partial<T>;
}

const PUBLICATION_FIELDS = ['name', 'publisher', 'releaseDate', 'url', 'summary', 'partners', 'tags'] as const;
const WORK_FIELDS = ['name', 'position', 'url', 'location', 'startDate', 'endDate', 'summary'] as const;
const EDUCATION_FIELDS = ['institution', 'area', 'studyType', 'url', 'startDate', 'endDate'] as const;

const byDateDesc = (a: Entry, b: Entry) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();

export const basics = () => pick(cv.basics, ['name', 'label', 'summary', 'profiles']);

export const publications = ({ featured = false } = {}) =>
	cv.publications
		.filter((pub: Entry) => !featured || pub.featured === true)
		.sort(byDateDesc)
		.map((pub) => pick(pub, PUBLICATION_FIELDS) as Entry & { name: string; releaseDate: string });

export const work = ({ featured = false } = {}) =>
	cv.work
		.filter((job: Entry) => !featured || job.featured === true)
		.map((job) => pick(job, WORK_FIELDS) as Entry & { name: string; position: string; startDate: string; endDate: string });

export const education = ({ featured = false } = {}) =>
	cv.education
		.filter((edu: Entry) => !featured || edu.featured === true)
		.map((edu) => pick(edu, EDUCATION_FIELDS) as Entry & { institution: string; area: string; studyType: string; startDate: string; endDate: string });

export const projects = () => cv.projects.map((project) => pick(project, ['name', 'url', 'description']) as { name: string; url: string; description: string });

/** Every URL a set of entries shows a favicon for. */
export const faviconSources = (...lists: Entry[][]) =>
	lists.flat().flatMap((entry) => [entry.url, ...(entry.partners ?? []).map((p: Entry) => p.url)]);
