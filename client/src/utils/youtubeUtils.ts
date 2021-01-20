export const getEmbedURL = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}?&controls=2&origin=${window.location.origin}&disablekb=1`;
};

export const extractVideoId = (videoURL: string): string | undefined => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = videoURL.match(regExp);
  if (match && match[7].length === 11) return match[7];
};

export const getThumbnailURL = (videoId: string, size: '0' | '1' | '2' | '3' = '0'): string => {
  return `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
};
