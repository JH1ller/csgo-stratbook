import { Component, Emit, Vue } from 'vue-property-decorator';
import { resolveAvatar } from '@/utils/resolveUrls';
import ago from 's-ago';
import { authModule, teamModule } from '@/store/namespaces';
import { Player, Team } from '@/services/models';


@Component({})
export default class MemberList extends Vue {
  @teamModule.State private teamInfo!: Team;
  @teamModule.State private teamMembers!: Player[];
  @authModule.State private profile!: Player;

  private resolveAvatar: typeof resolveAvatar = resolveAvatar;

  private mounted() {
    // * force UI update in interval for correct "time-ago" display
    // TODO: maybe unregister interval on unmount
    setInterval(() => this.$forceUpdate(), 1000);
  }

  @Emit()
  private leaveTeam(): void {
    return;
  }

  private lastOnlineString(lastOnline: Date): string | undefined {
    if (!lastOnline) return;
    const date = new Date(lastOnline);
    return ago(date);
  }
}