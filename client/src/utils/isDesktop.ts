//export const isDesktop = (): boolean => !!process?.versions?.electron;
export const isDesktop = (): boolean => navigator.userAgent.includes('Electron');
