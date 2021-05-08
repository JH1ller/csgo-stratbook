import { Component, Emit, Inject, Prop, Vue } from 'vue-property-decorator';
import { appModule, authModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Player } from '@/api/models/Player';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { FeedbackFish } from '@feedback-fish/vue';
import { Routes } from '@/router/router.models';
import TrackingService from '@/services/tracking.service';
import { catchPromise } from '@/utils/catchPromise';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { openLink } from '@/utils/openLink';

@Component({
  components: {
    FeedbackFish,
  },
})
export default class MainMenu extends Vue {
  private appName = 'stratbook'; // TODO: dynamic
  @Inject() private trackingService!: TrackingService;
  @authModule.State profile!: Player;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;
  @appModule.State private loading!: boolean;
  @Prop() private menuOpen!: boolean;

  private Routes: typeof Routes = Routes;
  private isDesktop = window.desktopMode;

  private get menuItems() {
    return [
      {
        label: 'Strats',
        icon: 'chess',
        link: '/strats',
        show: !!this.profile?.team,
      },
      {
        label: 'Grenades',
        icon: 'bomb',
        link: '/utility',
        show: !!this.profile?.team,
      },
      {
        label: 'Team',
        icon: 'users',
        link: this.profile.team ? '/team' : '/team/join', // TODO: check if this works!
        show: !!this.profile._id,
      },
    ].filter(item => item.show);
  }

  get avatarUrl() {
    return resolveStaticImageUrl(this.profile?.avatar);
  }

  private downloadDesktopClient(): void {
    catchPromise(
      this.showDialog({
        key: 'main-menu/download-desktop',
        text:
          'Click "Download now" to get the Stratbook desktop application. \
          It offers higher performance and might soon get features that wouldn\'nt be possible in the web version.\
          If Windows prevents running the app, you should be able to click "More Info" and "Run anyway".',
        resolveBtn: 'Download now',
        htmlMode: true,
      }),
      () => {
        // TODO: consider if we should just insert current version here
        window.open('https://csgo-stratbook.s3.eu-central-1.amazonaws.com/Stratbook+Setup+1.8.0.exe');
      }
    );
    this.trackingService.track('click:get-desktop-client');
  }

  private openTwitter() {
    openLink('https://twitter.com/csgostratbook');
  }

  private openDiscord() {
    openLink('https://discord.com/invite/mkxzQJGRgq');
  }

  private openDonationLink() {
    openLink('https://ko-fi.com/Q5Q02X2XQ');
  }

  @Emit()
  private toggleMenu() {
    return;
  }

  @Emit()
  private closeMenu() {
    return;
  }
}
