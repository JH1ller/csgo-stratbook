// Define a regular expression to match Gfycat URLs.
const gfycatRegexp = new RegExp(
  '^https://(?:giant.)?gfycat.com/([a-zA-Z]+(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?).(?:gif|webm|mp4)$',
);

/**
 * Extracts the Gfycat ID from a provided URL and returns it in an object.
 * @param gfycatUrl - The URL of the Gfycat video.
 * @returns - An object with the ID property set to the Gfycat ID or null if no valid ID could be extracted.
 */
export function extractGfycatIdFromUrl(gfycatUrl: string): { id: string } | null {
  // Attempt to match the URL against the defined regular expression.
  const [match, id] = gfycatUrl.match(gfycatRegexp) || [];
  // If the URL did not match the regular expression, return null.
  if (!match) {
    return null;
  }
  // Otherwise, return an object with the ID property set to the extracted Gfycat ID.
  return { id };
}

/**
 * Returns the Gfycat embed URL for a given Gfycat ID.
 * @param gfycatId - The ID of the Gfycat video.
 * @returns - The URL of the Gfycat video's embed.
 */
export function getGfycatEmbedUrl(gfycatId: { id: string }): string {
  return `https://gfycat.com/ifr/${gfycatId.id}`;
}

/**
 * Checks if a given URL is a Gfycat URL.
 * @param url - The URL to check.
 * @returns - True if the URL is a valid Gfycat URL, false otherwise.
 */
export function isGfycatUrl(url: string): boolean {
  return Boolean(extractGfycatIdFromUrl(url));
}

/**
 * Returns the thumbnail URL for a given Gfycat ID.
 * @param gfycatId - The ID of the Gfycat video.
 * @returns - The URL of the Gfycat video's thumbnail.
 */
export function getGfycatThumbnailUrl(gfycatId: { id: string }): string {
  return `https://thumbs.gfycat.com/${gfycatId.id}.webp`;
}

// Export all functions as an object.
export default {
  extractGfycatIdFromUrl,
  getGfycatEmbedUrl,
  isGfycatUrl,
  getGfycatThumbnailUrl,
};
