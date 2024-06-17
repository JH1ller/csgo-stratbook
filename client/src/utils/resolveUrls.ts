import { S3_URL } from '@/config';

export const resolveStaticImageUrl = (url?: string): string => {
  if (url) {
    if (/steamstatic\.com/.test(url)) return url;
    return `${S3_URL}${url}`;
  } else {
    return require('@/assets/images/default.jpg');
  }
};
