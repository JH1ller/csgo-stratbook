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

  get<T = any>(key: string): T | undefined | null {
    let value = localStorage.getItem(key);
    if (value == null) {
      Log.warn(`StorageService`, `No value found for '${key}'.`);
      return null;
    }
    try {
      const parsed = JSON.parse(value as string);
      value = parsed;
    } catch (error) {
      //
    }

    return value as T | undefined | null;
  }

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      Log.info(`StorageService`, `Saved value to key '${key}'`);
    } catch (error) {
      Log.error(`StorageService`, error);
    }
  }

  exists(key: string): boolean {
    return !!localStorage.getItem(key);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    Log.info(`StorageService`, `Removed value for '${key}'.`);
  }

  clear(): void {
    localStorage.clear();
    Log.info(`StorageService`, 'Store cleared.');
  }
}
