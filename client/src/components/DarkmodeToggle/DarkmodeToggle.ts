import StorageService from '@/services/storage.service';
import TrackingService from '@/services/tracking.service';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class DarkmodeToggle extends Vue {
  isDark = false;
  storageService = StorageService.getInstance();
  trackingService = TrackingService.getInstance();

  toggle() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('-dark');
    this.storageService.set('dark-mode', this.isDark);
    this.trackingService.track('Action: Switch Darkmode', { dark: this.isDark });
  }

  mounted() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (this.storageService.exists('dark-mode')) {
      this.isDark = this.storageService.get<boolean>('dark-mode')!;
    } else {
      this.isDark = systemPrefersDark;
    }

    if (this.isDark) document.body.classList.add('-dark');
  }
}
