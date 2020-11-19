import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import { resolveAvatar } from '@/utils/resolveUrls';
import ago from 's-ago';
import { Player, Team } from '@/api/models';

@Component({
  components: {}
})
export default class MemberList extends Vue {
  @Prop() private member!: Player;
  @Prop() private profile!: Player;
  @Prop() private teamInfo!: Team;

  private resolveAvatar: (url?: string) => string = resolveAvatar;

  @Emit()
  private openMenu($event: MouseEvent): { event: MouseEvent; member: Player } {
    return { event: $event, member: this.member };
  }

  private lastOnlineString(lastOnline: Date): string | undefined {
    if (!lastOnline) return;
    const date = new Date(lastOnline);
    return ago(date);
  }
}