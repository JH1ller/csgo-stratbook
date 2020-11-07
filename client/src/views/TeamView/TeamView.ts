import { Component, Vue } from 'vue-property-decorator';
import MemberList from './components/MemberList/MemberList.vue';
import TeamInfo from './components/TeamInfo/TeamInfo.vue';
import { appModule, teamModule } from '@/store/namespaces';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { Response } from '@/services/models';
import { Routes } from '@/router/router.models';

@Component({
  components: {
    MemberList,
    TeamInfo
  },
})
export default class TeamView extends Vue {
  @teamModule.Getter private teamAvatarUrl!: string;
  @teamModule.Action leaveTeam!: () => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;

  private async requestTeamLeave() {
    await this.showDialog({
      key: 'team-view/confirm-leave',
      text: 'Are you sure you want to leave your team?',
    });
    const res = await this.leaveTeam();
    if (res.success) this.$router.push(Routes.JoinTeam);
  }
}
