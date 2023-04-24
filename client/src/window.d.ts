export {};

declare global {
  interface Window {
    debugMode: boolean;
    desktopMode: boolean;
    twttr: {
      widgets: {
        load: () => void;
      };
    };
    appVersion: string;
  }
}
