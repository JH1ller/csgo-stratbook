import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
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

config.autoAddCss = false;
library.add(faTools, faUtensils, faBoxes, faUsers, faChess);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
  computed: mapState({
    profile: (state: any) => state.profile,
  }),
})
export default class MainMenu extends Vue {
  private appName: string = 'CSGO Stratbook'; //TODO: dynamic
  private profile!: Player | null;

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
    const win = remote.getCurrentWindow();
    // win?.setMinimumSize(660, this.calculateMinHeight());
    document.addEventListener('keydown', e => {
      if (e.key === 'd' && e.ctrlKey) {
        win.openDevTools();
      }
    });
  }

  get avatarUrl() {
    if (this.profile) {
      return process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/public/upload/${this.profile.avatar}`
        : `https://csgo-stratbook.herokuapp.com/public/upload/${this.profile.avatar}`;
    }
  }

  private calculateMinHeight() {
    return (this.menuItems.length + 1) * 70 + 30;
  }
}
