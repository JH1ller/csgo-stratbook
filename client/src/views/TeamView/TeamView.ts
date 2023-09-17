import { Component, Vue } from 'vue-property-decorator';
import MemberList from './components/MemberList/MemberList.vue';
import TeamInfo from './components/TeamInfo/TeamInfo.vue';
import { appModule, authModule, teamModule } from '@/store/namespaces';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { Response } from '@/store';
import { Routes } from '@/router/router.models';
import EditTeamForm from '@/components/EditTeamForm/EditTeamForm.vue';
import { Team } from '@/api/models/Team';
import { Player } from '@/api/models/Player';

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
  @teamModule.State teamMembers!: Player[];
  @teamModule.Action leaveTeam!: () => Promise<Response>;
  @teamModule.Action deleteTeam!: () => Promise<Response>;
  @teamModule.Action transferManager!: (memberID: string) => Promise<Response>;
  @teamModule.Action kickMember!: (memberID: string) => Promise<Response>;
  @teamModule.Action updateTeam!: (data: FormData) => Promise<Response>;
  @teamModule.Action updatePlayerColor!: (data: { _id: string; color: string }) => Promise<void>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @authModule.Action updateProfile!: (data: FormData) => Promise<void>;

  showEditForm = false;

  async requestTeamLeave() {
    const dialogResult = await this.showDialog({
      key: 'team-view/confirm-leave',
      text:
        this.teamMembers.length === 1
          ? 'Are you sure you want to leave your team?<br><bold>With no team members left, the team will be deleted.</bold>'
          : 'Are you sure you want to leave your team?',
      htmlMode: true,
    });

    if (dialogResult) {
      const res = await this.leaveTeam();
      if (res.success) this.$router.push(Routes.JoinTeam);
    }
  }
  async requestTeamDelete() {
    if (!this.isManager) return;

    const dialogResult = await this.showDialog({
      key: 'team-view/confirm-delete',
      text: 'Are you sure you want to delete this team? This action is permanent and non-reversable!',
    });
    if (dialogResult) {
      const res = await this.deleteTeam();
      if (res.success) this.$router.push(Routes.JoinTeam);
    }
  }

  async requestTransferManager(memberID: string) {
    const dialogResult = await this.showDialog({
      key: 'team-view/confirm-transfer',
      text: 'Are you sure you want to transfer team leadership?',
    });
    if (dialogResult) {
      this.transferManager(memberID);
    }
  }

  async requestKickMember(memberID: string) {
    const dialogResult = await this.showDialog({
      key: 'team-view/confirm-kick',
      text: 'Are you sure you want to kick this player?',
    });
    if (dialogResult) {
      this.kickMember(memberID);
    }
  }

  async requestTeamUpdate(formData: FormData) {
    const res = await this.updateTeam(formData);
    if (res.success) {
      this.toggleEditForm();
    }
  }

  toggleEditForm() {
    if (!this.isManager) return;

    this.showEditForm = !this.showEditForm;
  }
}
