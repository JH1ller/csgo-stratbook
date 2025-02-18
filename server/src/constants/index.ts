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
  '/forgot-password',
  '/reset',
  '/map',
  '/js',
  '/css',
  '/auth',
  '/img',
  '/socket.io',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.txt',
] as const;

export const CSP_HEADER = [
  "default-src 'self'",
  // Allow inline scripts, eval, and Splitbee
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.splitbee.io",
  // Also set script-src-elem explicitly
  "script-src-elem 'self' 'unsafe-inline' https://cdn.splitbee.io",
  // Allow inline styles and Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Allow font loading from Google Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Allow images
  "img-src 'self' data: https:",
  // Allow WebSocket connections and API calls
  "connect-src 'self' ws: wss: https: https://splitbee.io",
  // Allow Web Workers
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-src 'self'",
].join('; ');
