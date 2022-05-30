import { Component, Prop, Vue } from 'vue-property-decorator';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import ago from 's-ago';
import { Player } from '@/api/models/Player';
import { Team } from '@/api/models/Team';

@Component({
  components: {},
})
export default class MemberItem extends Vue {
  @Prop() private member!: Player;
  @Prop() private profile!: Player;
  @Prop() private teamInfo!: Team;

  private resolveStaticImageUrl: (url?: string) => string = resolveStaticImageUrl;

  private lastOnlineString(lastOnline?: Date): string | undefined {
    if (!lastOnline) return;
    const date = new Date(lastOnline);
    return ago(date);
  }
}
