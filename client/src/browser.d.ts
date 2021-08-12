/**
 * Interface for exposed glue-code functions from our electron preload script.
 */
export interface IpcService {
  configGetValue<T>(key: string): Promise<T>;
  configSetValue<T>(key: string, value: T): void;
  configRemoveKey(key: string): void;
  configClear(): void;

  openExternalLink(url: string): void;
  openExternalServerLink(ip: string, password: string): void;
  installRestartApp(): void;
  registerUpdateDownloadedHandler(handler: (version: string) => void): void;
  registerUpdateProgressHandler(handler: (progress: number) => void): void;
}

declare global {
  interface Window {
    ipcService: IpcService;
  }
}
