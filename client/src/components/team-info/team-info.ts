import { Component, Vue, Emit } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Team, Player } from '@/services/models';
const { shell } = require('electron').remote;
import ago from 's-ago';
import { Toast } from '../toast-wrapper/toast-wrapper.models';

const { remote } = require('electron');

const teamModule = namespace('team');
const authModule = namespace('auth');
const appModule = namespace('app');

@Component({})
export default class TeamInfo extends Vue {
  @appModule.Action private showToast!: (toast: Toast) => void;
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
    this.showToast({ id: 'teamInfo/copyCode', text: 'Join code copied' });
  }

  private copyServer() {
    navigator.clipboard.writeText(this.connectionString);
    this.showToast({ id: 'teamInfo/copyServer', text: 'Connection string copied' });
  }

  private runServer() {
    const currentWindow = remote.getCurrentWindow();
    currentWindow.loadURL(`steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`);
    this.showToast({ id: 'teamInfo/runServer', text: `Launching game and connecting to ${this.teamInfo.server?.ip}` });
  }

  @Emit()
  private leaveTeam() {
    return;
  }
}
