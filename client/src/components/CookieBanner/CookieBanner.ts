import { Component, Emit, Vue } from 'vue-property-decorator';

@Component({})
export default class CookieBanner extends Vue {
  private analyticsChecked = false;

  private setCookie(key: string, value: string) {
    document.cookie = `${key}=${value}; domain=${
      process.env.NODE_ENV === 'development' ? 'localhost' : 'stratbook.live'
    }; max-age=31536000; path=/`;
  }

  private saveClicked() {
    this.setCookie('bannerShown', 'true');
    this.setCookie('allowAnalytics', this.analyticsChecked.toString());
    this.close();
  }

  private acceptClicked() {
    this.setCookie('bannerShown', 'true');
    this.setCookie('allowAnalytics', 'true');
    this.close();
  }

  @Emit()
  private close() {}
}
