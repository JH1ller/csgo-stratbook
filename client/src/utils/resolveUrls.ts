import { S3_URL, STATIC_URL } from '@/config';

export const resolveStaticImageUrl = (url?: string): string => {
  if (url) {
    return `${S3_URL}${url}`;
  } else {
    return require('@/assets/images/default.jpg');
  }
};
