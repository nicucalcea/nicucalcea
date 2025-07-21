/**
 * Helper function to get favicon URL using Google's favicon service
 * @param {string} url - The URL to get favicon for
 * @returns {string} The favicon URL
 */
export function getFaviconUrl(url) {
  const domain = new URL(url).hostname;
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=32`;
}

/**
 * Helper function to get organization image
 * @param {string} name - The organization name
 * @param {string} url - The organization URL (optional)
 * @returns {string} The image URL (local image, favicon, or fallback icon)
 */
export function getOrgImage(name, url) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  /** @type {Record<string, string>} */
  const availableImages = {
    'bbc': 'bbc.png',
    'bbcnews': 'bbc.png',
    'infogr8': 'infogr8.jpg'
  };
  
  // If we have a local image, use it
  if (availableImages[cleanName]) {
    return `/media/orgs/${availableImages[cleanName]}`;
  }
  
  // If we have a URL, try to get the favicon
  if (url) {
    try {
      return getFaviconUrl(url);
    } catch (error) {
      console.warn('Failed to get favicon for', url, error);
    }
  }
  
  // Fallback to default icon
  return '/media/icons/briefcase.svg';
}
