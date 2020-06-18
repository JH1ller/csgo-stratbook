import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faTools,
  faUtensils,
  faBoxes,
  faUsers,
  faChess,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const remote = require('electron').remote;
import AuthService from '@/services/AuthService';
import { Player } from '@/services/models';
import { BrowserWindow } from 'electron';

config.autoAddCss = false;
library.add(faTools, faUtensils, faBoxes, faUsers, faChess);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class MainMenu extends Vue {
  private appName: string = 'CSGO Stratbook'; //TODO: dynamic
  @State('profile') profile!: Player;

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
        : `https://csgo-stratbook.herokuapp.com/public/upload/${this.profile.avatar}`;
    } else {
      return require('@/assets/images/default.jpg');
    }
  }

  private calculateMinHeight() {
    return (this.menuItems.length + 1) * 70 + 30;
  }
}
