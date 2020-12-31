import { Component, Vue } from 'vue-property-decorator';
import MemberList from './components/MemberList/MemberList.vue';
import TeamInfo from './components/TeamInfo/TeamInfo.vue';
import { appModule, teamModule } from '@/store/namespaces';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { Response } from '@/store';
import { Routes } from '@/router/router.models';
import EditTeamForm from '@/components/EditTeamForm/EditTeamForm.vue';
import { Team } from '@/api/models/Team';
import { catchPromise } from '@/utils/catchPromise';

@Component({
  components: {
    MemberList,
    TeamInfo,
    EditTeamForm,
  },
})
export default class TeamView extends Vue {
  @teamModule.Getter private teamAvatarUrl!: string;
  @teamModule.Getter private serverString!: string;
  @teamModule.Getter private isManager!: boolean;
  @teamModule.State private teamInfo!: Team;
  @teamModule.Action private leaveTeam!: () => Promise<Response>;
  @teamModule.Action private deleteTeam!: () => Promise<Response>;
  @teamModule.Action private transferManager!: (memberID: string) => Promise<Response>;
  @teamModule.Action private kickMember!: (memberID: string) => Promise<Response>;
  @teamModule.Action private updateTeam!: (data: FormData) => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;

  private showEditForm: boolean = false;

  private requestTeamLeave() {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-leave',
        text: 'Are you sure you want to leave your team?',
      }),
      async () => {
        const res = await this.leaveTeam();
        if (res.success) this.$router.push(Routes.JoinTeam);
      }
    );
  }
  private requestTeamDelete() {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-delete',
        text: 'Are you sure you want to delete this team? This action is permanent and non-reversable!',
      }),
      async () => {
        const res = await this.deleteTeam();
        if (res.success) this.$router.push(Routes.JoinTeam);
      }
    );
  }

  private requestTransferManager(memberID: string) {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-transfer',
        text: 'Are you sure you want to transfer team leadership?',
      }),
      () => this.transferManager(memberID)
    );
  }

  private requestKickMember(memberID: string) {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-kick',
        text: 'Are you sure you want to kick this player?',
      }),
      () => this.kickMember(memberID)
    );
  }

  private async requestTeamUpdate(formData: FormData) {
    const res = await this.updateTeam(formData);
    if (res.success) {
      this.toggleEditForm();
    }
  }

  private toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }
}
