const FALLBACK = '/icons/briefcase.svg';

/**
 * @param {string | undefined} url
 * @returns {string | undefined} The URL's hostname, or undefined if it has none
 */
export function hostname(url) {
	if (!url || url.trim() === '') return undefined;
	try {
		return new URL(url).hostname || undefined;
	} catch {
		return undefined;
	}
}

/**
 * @param {string} domain
 * @returns {string} Google's favicon service URL for a domain
 */
export function faviconUrl(domain) {
	return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`;
}

/**
 * Favicon for a URL, via Google's favicon service.
 * @param {string | undefined} url - The URL to get the favicon for
 * @param {string[]} [missing] - Domains known to have no favicon (checked at build time)
 * @returns {string} The favicon URL or the fallback icon
 */
export function getFavicon(url, missing = []) {
	const domain = hostname(url);
	if (!domain || missing.includes(domain)) return FALLBACK;
	return faviconUrl(domain);
}
