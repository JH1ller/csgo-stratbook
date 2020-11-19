import { Component, Vue } from 'vue-property-decorator';
import { Player } from '@/api/models';
import { authModule } from '@/store/namespaces';
import { resolveAvatar } from '@/utils/resolveUrls';

@Component({})
export default class MainMenu extends Vue {
  private appName: string = 'CSGO Stratbook'; // TODO: dynamic
  @authModule.State profile!: Player;

  private menuItems = [
    {
      label: 'Strats',
      icon: 'chess',
      link: '/strats',
    },
    {
      label: 'Grenades',
      icon: 'bomb',
      link: '/nadebook',
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
    return resolveAvatar(this.profile?.avatar);
  }
}
