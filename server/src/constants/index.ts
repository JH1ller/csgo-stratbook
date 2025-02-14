export const COLORS = ['#1EBC9C', '#3298DB', '#F2C512', '#A463BF', '#E84B3C', '#e467da', '#4a61b5', '#41b971'];

export const Path = {
  app: '/',
  home: '/home/',
  api: '/api/',
  static: '/static',
} as const;

export type Path = (typeof Path)[keyof typeof Path];

export const PUBLIC_PATHS = [
  '/home',
  '/static',
  '/api',
  '/login',
  '/register',
  '/js',
  '/css',
  '/auth',
  '/img',
  '/socket.io',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.txt',
] as const;
