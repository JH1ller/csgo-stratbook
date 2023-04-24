export const isDesktop = () => navigator.userAgent.includes('Electron');

export function isElectron() {
  return process.env.BUILD_TARGET === 'ELECTRON';
}
