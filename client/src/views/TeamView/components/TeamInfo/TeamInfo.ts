import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { appModule, teamModule } from '@/store/namespaces';
import { Team } from '@/api/models/Team';

@Component({})
export default class TeamInfo extends Vue {
  @appModule.Action private showToast!: (toast: Toast) => void;
  @Prop() private serverString!: string;
  @Prop() private isManager!: boolean;
  @Prop() private teamInfo!: Team;

  private openWebsite() {
    if (process?.versions?.electron) {
      const { remote } = require('electron');
      remote.shell.openExternal(this.teamInfo.website as string);
    } else {
      window.open(this.teamInfo.website, '_blank');
    }
  }

  private copyCode() {
    navigator.clipboard.writeText(this.teamInfo.code.toUpperCase());
    this.showToast({ id: 'teamInfo/copyCode', text: 'Join code copied' });
  }

  private copyServer() {
    if (!this.teamInfo.server?.ip) return;
    
    navigator.clipboard.writeText(this.serverString);
    this.showToast({ id: 'teamInfo/copyServer', text: 'Connection string copied' });
  }

  private runServer() {
    if (!this.teamInfo.server?.ip) return;

    if (process?.versions?.electron) {
      const { remote } = require('electron');
      const currentWindow = remote.getCurrentWindow();
      currentWindow.loadURL(`steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`);
    } else {
      window.open(`steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`, '_blank');
    }

    this.showToast({ id: 'teamInfo/runServer', text: `Launching game and connecting to ${this.teamInfo.server?.ip}` });
  }

  @Emit()
  private showEdit(): void {
    return;
  }

  @Emit()
  private deleteTeam(): void {
    return;
  }
}
