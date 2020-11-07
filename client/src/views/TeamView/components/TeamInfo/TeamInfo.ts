import { Component, Vue } from 'vue-property-decorator';
import { Team } from '@/services/models';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { appModule, teamModule } from '@/store/namespaces';

const { remote } = require('electron');

@Component({})
export default class TeamInfo extends Vue {
  @appModule.Action private showToast!: (toast: Toast) => void;
  @teamModule.State private teamInfo!: Team;
  @teamModule.Getter private connectionString!: string;

  private openWebsite() {
    if (this.teamInfo.website) remote.shell.openExternal(this.teamInfo.website);
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
}
