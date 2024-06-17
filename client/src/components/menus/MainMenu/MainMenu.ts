import { Component, Emit, Inject, Prop, Vue } from 'vue-property-decorator';
import { appModule, authModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Player } from '@/api/models/Player';
import { Routes } from '@/router/router.models';
import TrackingService from '@/services/tracking.service';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { openLink } from '@/utils/openLink';
import DarkmodeToggle from '@/components/DarkmodeToggle/DarkmodeToggle.vue';

@Component({
  components: {
    DarkmodeToggle,
  },
})
export default class MainMenu extends Vue {
  readonly appName = 'stratbook';
  @Inject() trackingService!: TrackingService;
  @authModule.State profile!: Player;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @Prop() menuOpen!: boolean;

  Routes: typeof Routes = Routes;

  get menuItems() {
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

  openTwitter() {
    this.trackingService.track('Click: Open Twitter');
    openLink('https://twitter.com/csgostratbook');
  }

  openDiscord() {
    this.trackingService.track('Click: Open Discord');
    openLink('https://discord.com/invite/mkxzQJGRgq');
  }

  openDonationLink() {
    this.trackingService.track('Click: Open Ko-Fi');
    openLink('https://ko-fi.com/Q5Q02X2XQ');
  }

  @Emit()
  toggleMenu() {
    return;
  }

  @Emit()
  closeMenu() {
    return;
  }
}
