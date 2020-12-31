import { S3_URL, STATIC_URL } from '@/config';

export const resolveStaticImageUrl = (url?: string): string => {
  if (url) {
    //return process.env.NODE_ENV === 'development' ? `${STATIC_URL}upload/${url}` : `${S3_URL}${url}`;
    return `${S3_URL}${url}`;
  } else {
    return require('@/assets/images/default.jpg');
  }
};
