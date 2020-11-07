export const resolveAvatar = (url?: string): string => {
  if (url) {
    return process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/public/upload/${url}`
      : `https://csgo-stratbook.s3.amazonaws.com/${url}`;
  } else {
    return require('@/assets/images/default.jpg');
  }
}