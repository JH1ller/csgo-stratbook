import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { appModule } from '@/store/namespaces';
import { Team } from '@/api/models/Team';
import { openLink } from '@/utils/openLink';
import TrackingService from '@/services/tracking.service';
import { writeToClipboard } from '@/utils/writeToClipboard';

@Component({})
export default class TeamInfo extends Vue {
  @appModule.Action private showToast!: (toast: Toast) => void;
  @Prop() private serverString!: string;
  @Prop() private isManager!: boolean;
  @Prop() private teamInfo!: Team;

  private trackingService = TrackingService.getInstance();

  private get serverIp() {
    return this.teamInfo.server?.ip;
  }

  private openWebsite() {
    openLink(this.teamInfo.website!);
  }

  private copyCode() {
    writeToClipboard(this.teamInfo.code.toUpperCase());
    this.showToast({ id: 'teamInfo/copyCode', text: 'Join code copied' });
  }

  private copyServer() {
    if (!this.teamInfo.server?.ip) return;

    writeToClipboard(this.serverString);
    this.showToast({ id: 'teamInfo/copyServer', text: 'Connection string copied' });
  }

  private runServer() {
    if (!this.teamInfo.server?.ip) return;

    openLink(`steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`);

    this.showToast({ id: 'teamInfo/runServer', text: `Launching game and connecting to ${this.teamInfo.server?.ip}` });
    this.trackingService.track('Action: Run Game');
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
