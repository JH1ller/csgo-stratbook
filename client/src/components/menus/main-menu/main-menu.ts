import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
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

config.autoAddCss = false;
library.add(faTools, faUtensils, faBoxes, faUsers, faChess);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class MainMenu extends Vue {
  private appName: string = 'CSGO Stratbook'; //TODO: dynamic

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

  private mounted() {
    const win = remote.getCurrentWindow();
    // win?.setMinimumSize(660, this.calculateMinHeight());
    document.addEventListener('keydown', e => {
      if (e.key === 'd' && e.ctrlKey) {
        win.openDevTools();
        const authService = AuthService.getInstance();
        authService.getPlayerInfo();
      }
    });
  }

  private calculateMinHeight() {
    return (this.menuItems.length + 1) * 70 + 30;
  }
}
