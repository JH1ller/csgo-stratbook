export {};

declare global {
  interface Window {
    debugMode: boolean;
    desktopMode: boolean;
    appVersion: string;
  }
}
