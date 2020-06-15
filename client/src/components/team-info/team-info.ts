import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Team, Player } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faCrown, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const { remote } = require('electron');

config.autoAddCss = false;
library.add(faCopy, faCrown, faGamepad);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class TeamInfo extends Vue {
  @State('teamInfo') teamInfo!: Team;
  @State('profile') profile!: Player;
  @State('teamMembers') teamMembers!: Player[];

  get avatarUrl() {
    if (this.teamInfo.avatar) {
      return process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/public/upload/${this.teamInfo.avatar}`
        : `https://csgo-stratbook.herokuapp.com/public/upload/${this.teamInfo.avatar}`;
    } else {
      return require('@/assets/images/default.jpg');
    }
  }

  private resolveAvatar(url: string) {
    if (url) {
      return process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/public/upload/${url}`
        : `https://csgo-stratbook.herokuapp.com/public/upload/${url}`;
    } else {
      return require('@/assets/images/default.jpg');
    }
  }

  private copyCode() {
    navigator.clipboard.writeText(this.teamInfo.code.toUpperCase());
    this.$store.dispatch('showToast', 'Join code copied');
  }

  private copyServer() {
    navigator.clipboard.writeText(this.connectionString);
    this.$store.dispatch('showToast', 'Connection string copied');
  }

  private runServer() {
    const currentWindow = remote.getCurrentWindow();
    currentWindow.loadURL(
      `steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`
    );
    this.$store.dispatch(
      'showToast',
      `Launching game and connecting to ${this.teamInfo.server?.ip}`
    );
  }

  get connectionString() {
    return `connect ${this.teamInfo.server?.ip}; ${
      this.teamInfo.server?.password
        ? `password ${this.teamInfo.server?.password}`
        : ''
    }`;
  }

  @Emit()
  private leaveTeam() {
    return;
  }
}
