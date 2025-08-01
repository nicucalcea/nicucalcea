/**
 * Helper function to get favicon URL using Google's favicon service
 * @param {string} url - The URL to get favicon for
 * @returns {string} The favicon URL or fallback icon
 */
export function getFavicon(url) {
  // Return fallback icon if URL is empty, null, or undefined
  if (!url || url.trim() === '') {
    return '/icons/briefcase.svg';
  }
  
  try {
    const domain = new URL(url).hostname;
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`;
  } catch (error) {
    // Return fallback icon if URL is invalid
    return '/icons/briefcase.svg';
  }
}