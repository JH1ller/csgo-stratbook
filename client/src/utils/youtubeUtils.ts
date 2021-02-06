export const getEmbedURL = (videoId: string, timestamp = '0'): string => {
  return `https://www.youtube.com/embed/${videoId}?&controls=2&origin=${window.location.origin}&disablekb=1&start=${timestamp}`;
};

export const extractVideoId = (videoURL: string): string | undefined => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = videoURL.match(regExp);
  if (match && match[7].length === 11) return match[7];
};

export const extractTimestamp = (videoURL: string): string | undefined => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)(?:(\?t|&start)=(\d+))?.*/;
  const match = videoURL.match(regExp);
  return match?.[4];
};

export const getThumbnailURL = (videoId: string, size: '0' | '1' | '2' | '3' = '0'): string => {
  return `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
};
