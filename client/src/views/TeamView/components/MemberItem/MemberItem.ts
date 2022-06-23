import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import ago from 's-ago';
import { Player } from '@/api/models/Player';
import { Team } from '@/api/models/Team';
import VSwatches from 'vue-swatches';

@Component({
  components: {
    VSwatches,
  },
})
export default class MemberItem extends Vue {
  @Prop() member!: Player;
  @Prop() profile!: Player;
  @Prop() teamInfo!: Team;

  resolveStaticImageUrl: (url?: string) => string = resolveStaticImageUrl;

  lastOnlineString(lastOnline?: Date): string | undefined {
    if (!lastOnline) return;
    const date = new Date(lastOnline);
    return ago(date);
  }

  get isManager(): boolean {
    return this.teamInfo.manager === this.profile._id;
  }

  @Emit()
  updateColor(payload: { _id: string; color: string }) {
    return payload;
  }

  @Emit()
  transferManager(id: string) {
    return id;
  }

  @Emit()
  kickMember(id: string) {
    return id;
  }
}
