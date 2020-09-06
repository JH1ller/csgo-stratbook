import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Team, Player } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faCrown, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const { shell } = require('electron').remote;
import ago from 's-ago';

const { remote } = require('electron');

config.autoAddCss = false;
library.add(faCopy, faCrown, faGamepad);
Vue.component('font-awesome-icon', FontAwesomeIcon);

const teamModule = namespace('team');
const authModule = namespace('auth');
const appModule = namespace('app');

@Component({})
export default class TeamInfo extends Vue {
  @appModule.Action private showToast!: (text: string) => void;
  @teamModule.State private teamInfo!: Team;
  @authModule.State private profile!: Player;
  @teamModule.State private teamMembers!: Player[];
  @teamModule.Getter private teamAvatarUrl!: string;
  @teamModule.Getter private connectionString!: string;

  private resolveAvatar(url: string) {
    if (url) {
      return process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/public/upload/${url}`
        : `https://csgo-stratbook.s3.amazonaws.com/${url}`;
    } else {
      return require('@/assets/images/default.jpg');
    }
  }

  private openWebsite() {
    if (this.teamInfo.website) shell.openExternal(this.teamInfo.website);
  }

  private lastOnlineString(lastOnline: Date) {
    if (!lastOnline) return;
    const date = new Date(lastOnline);
    return ago(date);
  }

  private copyCode() {
    navigator.clipboard.writeText(this.teamInfo.code.toUpperCase());
    this.showToast('Join code copied');
  }

  private copyServer() {
    navigator.clipboard.writeText(this.connectionString);
    this.showToast('Connection string copied');
  }

  private runServer() {
    const currentWindow = remote.getCurrentWindow();
    currentWindow.loadURL(`steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`);
    this.showToast(`Launching game and connecting to ${this.teamInfo.server?.ip}`);
  }

  @Emit()
  private leaveTeam() {
    return;
  }
}
