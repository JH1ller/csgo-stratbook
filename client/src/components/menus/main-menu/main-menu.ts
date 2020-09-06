import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const remote = require('electron').remote;
import { Player } from '@/services/models';
import { BrowserWindow } from 'electron';

const authModule = namespace('auth');

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
    const win: BrowserWindow = remote.getCurrentWindow();
    // win?.setMinimumSize(660, this.calculateMinHeight());
    document.addEventListener('keydown', e => {
      if (e.key === 'd' && e.ctrlKey) {
        win.webContents.openDevTools();
      }
    });
  }

  get avatarUrl() {
    if (this.profile?.avatar) {
      return process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/public/upload/${this.profile.avatar}`
        : `https://csgo-stratbook.s3.amazonaws.com/${this.profile.avatar}`;
    } else {
      return require('@/assets/images/default.jpg');
    }
  }

  private calculateMinHeight() {
    return (this.menuItems.length + 1) * 70 + 30;
  }
}
