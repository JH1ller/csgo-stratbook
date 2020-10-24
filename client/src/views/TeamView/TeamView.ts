import { Component, Vue } from 'vue-property-decorator';
import MemberList from './components/MemberList/MemberList.vue';
import TeamInfo from './components/TeamInfo/TeamInfo.vue';
import { appModule, teamModule } from '@/store/namespaces';
import { Dialog } from '@/components/dialog-wrapper/dialog-wrapper.models';

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

  private requestTeamLeave() {
    this.showDialog({
      key: 'team-view/confirm-leave',
      text: 'Are you sure you want to leave your team?',
    }).then(() => this.leaveTeam());
  }
}
