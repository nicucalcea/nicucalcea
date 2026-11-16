// Build-time favicon check. Pages are prerendered, so this runs once per
// build: domains whose Google favicon request 404s get listed, and the
// browser shows the local fallback for them instead of logging an error.
import { faviconUrl, hostname } from '#lib/utils/getIcon.js';

const cache = new Map<string, Promise<boolean>>();

function isMissing(domain: string): Promise<boolean> {
	let result = cache.get(domain);
	if (!result) {
		result = fetch(faviconUrl(domain), { method: 'HEAD', signal: AbortSignal.timeout(10_000) })
			.then((response) => response.status === 404)
			// Offline or slow: keep the remote icon, as before this check existed
			.catch(() => false);
		cache.set(domain, result);
	}
	return result;
}

/** Domains (from the given URLs) that have no favicon at Google's service. */
export async function missingFavicons(urls: Array<string | undefined>): Promise<string[]> {
	const domains = [...new Set(urls.map(hostname).filter((domain): domain is string => Boolean(domain)))];
	const missing = await Promise.all(domains.map(isMissing));
	return domains.filter((_, i) => missing[i]).sort();
}
