import { Shortcuts } from 'shortcuts';
import { ShortcutDescriptor } from 'shortcuts/dist/types';

export default class ShortcutService {
  private static instance: ShortcutService;
  private shortcutsInstance: Shortcuts;

  private constructor() {
    this.shortcutsInstance = new Shortcuts();
  }

  static getInstance(): ShortcutService {
    if (!ShortcutService.instance) {
      ShortcutService.instance = new ShortcutService();
    }
    return ShortcutService.instance;
  }

  add(descriptors: ShortcutDescriptor | ShortcutDescriptor[]): void {
    this.shortcutsInstance.add(descriptors);
  }

  reset(): void {
    this.shortcutsInstance.reset();
  }
}
