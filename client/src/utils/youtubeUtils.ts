const youtubeRegexp =
  /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]{11})(?:(?:\?t|&start)=(\d+))?.*/;

export const getEmbedURL = (videoId: string, timestamp = '0'): string => {
  return `https://www.youtube.com/embed/${videoId}?&controls=2&origin=${window.location.origin}&disablekb=1&start=${timestamp}`;
};

export const parseYoutubeUrl = (videoURL: string): { id: string; timestamp?: string } | null => {
  const urlMatches = videoURL.match(youtubeRegexp);
  if (!urlMatches) return null;
  const [, id, timestamp] = urlMatches;
  return { id, timestamp };
};

export const getThumbnailURL = (videoId: string, size: '0' | '1' | '2' | '3' = '0'): string => {
  return `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
};
