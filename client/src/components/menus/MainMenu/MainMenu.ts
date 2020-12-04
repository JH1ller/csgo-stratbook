import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { appModule, authModule } from '@/store/namespaces';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Player } from '@/api/models/Player';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { FeedbackFish } from '@feedback-fish/vue';

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

  private menuItems = [
    {
      label: 'Strats',
      icon: 'chess',
      link: '/strats',
    },
    {
      label: 'Grenades',
      icon: 'bomb',
      link: '/utility',
    },
    {
      label: 'Team',
      icon: 'users',
      link: '/team',
    },
    {
      label: 'Settings',
      icon: 'tools',
      link: '/settings',
    },
  ];

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
