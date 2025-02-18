import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { appModule, teamModule } from '@/store/namespaces';
import { Team } from '@/api/models/Team';
import { openLink } from '@/utils/openLink';
import TrackingService from '@/services/tracking.service';
import { writeToClipboard } from '@/utils/writeToClipboard';
import SmartImage from '@/components/SmartImage/SmartImage.vue';

@Component({
  components: {
    SmartImage,
  },
})
export default class TeamInfo extends Vue {
  @teamModule.Getter teamAvatarUrl!: string;
  @appModule.Action showToast!: (toast: Toast) => void;
  @Prop() serverString!: string;
  @Prop() isManager!: boolean;
  @Prop() teamInfo!: Team;

  trackingService = TrackingService.getInstance();

  get serverIp() {
    return this.teamInfo.server?.ip;
  }

  openWebsite() {
    openLink(this.teamInfo.website!);
  }

  async copyCode() {
    const result = await writeToClipboard(this.teamInfo.code.toUpperCase());
    if (result) this.showToast({ id: 'teamInfo/copyCode', text: 'Join code copied' });
  }

  copyServer() {
    if (!this.teamInfo.server?.ip) return;

    writeToClipboard(this.serverString);
    this.showToast({ id: 'teamInfo/copyServer', text: 'Connection string copied' });
  }

  runServer() {
    if (!this.teamInfo.server?.ip) return;

    openLink(`steam://connect/${this.teamInfo.server?.ip}/${this.teamInfo.server?.password}`);

    this.showToast({ id: 'teamInfo/runServer', text: `Launching game and connecting to ${this.teamInfo.server?.ip}` });
    this.trackingService.track('Action: Run Game');
  }

  @Emit()
  showEdit(): void {
    return;
  }

  @Emit()
  deleteTeam(): void {
    return;
  }

  @Emit()
  leaveTeam(): void {
    return;
  }
}
