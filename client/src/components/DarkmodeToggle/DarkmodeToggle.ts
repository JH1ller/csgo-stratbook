import StorageService from '@/services/storage.service';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class DarkmodeToggle extends Vue {
  isDark = false;
  storageService = StorageService.getInstance();

  toggle() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('-dark');
  }

  mounted() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const sitePrefersDark = this.storageService.get<boolean>('dark-mode');
  }
}
