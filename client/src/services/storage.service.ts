import { isDesktop } from '@/utils/isDesktop';
import { Log } from '@/utils/logger';

export default class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async get<T = any>(key: string): Promise<T | undefined | null> {
    if (isDesktop()) {
      const value = await window.ipcService.configGetValue<T>(key);

      if (!value) {
        Log.warn(`StorageService ('electron')`, `No value found for '${key}'.`);
      }

      return value;
    } else {
      const localValue = localStorage.getItem(key);
      if (!localValue) {
        Log.warn(`StorageService ('browser')`, `No value found for '${key}'.`);
      } else {
        return JSON.parse(localValue as string) as T | undefined | null;
      }
    }

    return null;
  }

  set(key: string, value: unknown): void {
    if (isDesktop()) {
      window.ipcService.configSetValue(key, value);
    } else {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }

    Log.info(`StorageService (${isDesktop() ? 'native' : 'browser'})`, `Saved value to key '${key}':`, value);
  }

  exists(key: string): boolean {
    return !!this.get(key);
  }

  remove(key: string): void {
    if (isDesktop()) {
      window.ipcService.configRemoveKey(key);
    } else {
      localStorage.removeItem(key);
    }
    Log.info(`StorageService (${isDesktop() ? 'native' : 'browser'})`, `Removed value for '${key}'.`);
  }

  clear(): void {
    if (isDesktop()) {
      window.ipcService.configClear();
    } else {
      localStorage.clear();
    }
    Log.info(`StorageService (${isDesktop() ? 'native' : 'browser'})`, 'Store cleared.');
  }
}
