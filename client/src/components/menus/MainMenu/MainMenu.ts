import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { appModule, authModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Player } from '@/api/models/Player';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { FeedbackFish } from '@feedback-fish/vue';
import { Status } from '@/store/modules/auth';
import { Routes } from '@/router/router.models';

@Component({
  components: {
    FeedbackFish,
  },
})
export default class MainMenu extends Vue {
  private appName: string = 'stratbook'; // TODO: dynamic
  @authModule.State profile!: Player;
  @appModule.Action private showToast!: (toast: Toast) => void;
  @appModule.State private loading!: boolean;
  @Prop() private menuOpen!: boolean;

  private Routes: typeof Routes = Routes;

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

  private async mounted() {
    if (process?.versions?.electron) {
      const remote = require('electron').remote;
      const win = remote.getCurrentWindow();
      // win?.setMinimumSize(660, this.calculateMinHeight());
      document.addEventListener('keydown', e => {
        if (e.key === 'd' && e.ctrlKey) {
          win.webContents.openDevTools();
        }
      });
    }
  }

  get avatarUrl() {
    return resolveStaticImageUrl(this.profile?.avatar);
  }

  private downloadDesktopClient(): void {
    this.showToast({ id: 'mainMenu/downloadDesktopClient', text: 'Coming soon!' });
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
