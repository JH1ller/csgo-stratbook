import { Component, Emit, Inject, Prop, Vue } from 'vue-property-decorator';
import { appModule, authModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Player } from '@/api/models/Player';
import { Routes } from '@/router/router.models';
import TrackingService from '@/services/tracking.service';
import { catchPromise } from '@/utils/catchPromise';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { openLink } from '@/utils/openLink';
import DarkmodeToggle from '@/components/DarkmodeToggle/DarkmodeToggle.vue';

@Component({
  components: {
    DarkmodeToggle,
  },
})
export default class MainMenu extends Vue {
  private appName = 'stratbook'; // TODO: dynamic
  @Inject() private trackingService!: TrackingService;
  @authModule.State profile!: Player;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;
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
        label: 'Map',
        icon: 'map',
        link: '/map',
        show: true,
      },
      {
        label: 'Team',
        icon: 'users',
        link: this.profile.team ? '/team' : '/team/join', // TODO: check if this works!
        show: !!this.profile._id,
      },
    ].filter((item) => item.show);
  }

  get avatarUrl() {
    return resolveStaticImageUrl(this.profile?.avatar);
  }

  private downloadDesktopClient(): void {
    catchPromise(
      this.showDialog({
        key: 'main-menu/download-desktop',
        text: 'Click <b>Download now</b> to get the Stratbook desktop application.<br/> \
          It offers better performance and might later get features that are not possible in the web version.<br/>\
          If Windows prevents running the app, you should be able to click <b>More Info</b> and <b>Run anyway</b>.<br/> \
          The app automatically checks for updates on startup.',
        resolveBtn: 'Download now',
        htmlMode: true,
      }),
      () => {
        this.trackingService.track('Action: Download Desktop Client');
        window.open(`https://csgo-stratbook.s3.eu-central-1.amazonaws.com/Stratbook+Setup+${window.appVersion}.exe`);
      },
    );
    this.trackingService.track('Click: Get Desktop Client');
  }

  private openTwitter() {
    this.trackingService.track('Click: Open Twitter');
    openLink('https://twitter.com/csgostratbook');
  }

  private openDiscord() {
    this.trackingService.track('Click: Open Discord');
    openLink('https://discord.com/invite/mkxzQJGRgq');
  }

  private openGithub() {
    this.trackingService.track('Click: Open Github');
    openLink('https://github.com/JH1ller/csgo-stratbook');
  }

  private openDonationLink() {
    this.trackingService.track('Click: Open Ko-Fi');
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
