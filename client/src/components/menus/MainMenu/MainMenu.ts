import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { appModule, authModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Player } from '@/api/models/Player';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { FeedbackFish } from '@feedback-fish/vue';
import { Status } from '@/store/modules/auth';

@Component({
  components: {
    FeedbackFish,
  },
})
export default class MainMenu extends Vue {
  private appName: string = 'stratbook'; // TODO: dynamic
  @authModule.State profile!: Player;
  @authModule.State status!: Status;
  @appModule.Action private showToast!: (toast: Toast) => void;
  @appModule.State private loading!: boolean;
  @Prop() private menuOpen!: boolean;

  private get _menuItems() {
    return [
      {
        label: 'Strats',
        icon: 'chess',
        link: '/strats',
        hide: this.status === Status.NO_AUTH,
      },
      {
        label: 'Grenades',
        icon: 'bomb',
        link: '/utility',
        hide: this.status === Status.NO_AUTH,
      },
      {
        label: 'Team',
        icon: 'users',
        link: this.profile.team ? '/team' : '/team/join', // TODO: check if this works!
        hide: this.status === Status.NO_AUTH,
      },
    ].filter(item => !item.hide);
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
