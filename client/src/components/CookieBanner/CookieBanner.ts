import { HOST_NAME } from '@/config';
import StorageService from '@/services/storage.service';
import { Component, Emit, Inject, Vue } from 'vue-property-decorator';

@Component({})
export default class CookieBanner extends Vue {
  @Inject() storageService!: StorageService;
  private analyticsChecked = false;

  private setCookie(key: string, value: string) {
    document.cookie = `${key}=${value}; domain=${HOST_NAME}; max-age=31536000; path=/`;
  }

  private saveClicked() {
    this.setCookie('bannerShown', 'true');
    this.setCookie('allowAnalytics', this.analyticsChecked.toString());
    this.storageService.set('bannerShown', true);
    this.storageService.set('allowAnalytics', this.analyticsChecked.toString());
    this.close();
  }

  private acceptClicked() {
    this.setCookie('bannerShown', 'true');
    this.setCookie('allowAnalytics', 'true');
    this.storageService.set('bannerShown', true);
    this.storageService.set('allowAnalytics', true);
    this.close();
  }

  @Emit()
  private close() {
    return;
  }
}
