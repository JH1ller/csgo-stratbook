import { Component, Vue } from 'vue-property-decorator';
import MemberList from './components/MemberList/MemberList.vue';
import TeamInfo from './components/TeamInfo/TeamInfo.vue';
import { appModule, authModule, teamModule } from '@/store/namespaces';
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
  @teamModule.Getter serverString!: string;
  @teamModule.Getter isManager!: boolean;
  @teamModule.State teamInfo!: Team;
  @teamModule.Action leaveTeam!: () => Promise<Response>;
  @teamModule.Action deleteTeam!: () => Promise<Response>;
  @teamModule.Action transferManager!: (memberID: string) => Promise<Response>;
  @teamModule.Action kickMember!: (memberID: string) => Promise<Response>;
  @teamModule.Action updateTeam!: (data: FormData) => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;
  @authModule.Action private updateProfile!: (data: FormData) => Promise<void>;

  showEditForm = false;

  requestTeamLeave() {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-leave',
        text: 'Are you sure you want to leave your team?',
      }),
      async () => {
        const res = await this.leaveTeam();
        if (res.success) this.$router.push(Routes.JoinTeam);
      },
    );
  }
  requestTeamDelete() {
    if (!this.isManager) return;

    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-delete',
        text: 'Are you sure you want to delete this team? This action is permanent and non-reversable!',
      }),
      async () => {
        const res = await this.deleteTeam();
        if (res.success) this.$router.push(Routes.JoinTeam);
      },
    );
  }

  requestTransferManager(memberID: string) {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-transfer',
        text: 'Are you sure you want to transfer team leadership?',
      }),
      () => this.transferManager(memberID),
    );
  }

  requestKickMember(memberID: string) {
    catchPromise(
      this.showDialog({
        key: 'team-view/confirm-kick',
        text: 'Are you sure you want to kick this player?',
      }),
      () => this.kickMember(memberID),
    );
  }

  async requestTeamUpdate(formData: FormData) {
    const res = await this.updateTeam(formData);
    if (res.success) {
      this.toggleEditForm();
    }
  }

  requestColorUpdate(color: string) {
    const formData = new FormData();
    formData.append('color', color);
    return this.updateProfile(formData);
  }

  toggleEditForm() {
    if (!this.isManager) return;

    this.showEditForm = !this.showEditForm;
  }
}
