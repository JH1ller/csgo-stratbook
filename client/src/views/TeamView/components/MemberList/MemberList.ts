import { Component, Emit, Ref, Vue } from 'vue-property-decorator';
import { authModule, teamModule } from '@/store/namespaces';
import MemberItem from '../MemberItem/MemberItem.vue';
import VueContext from 'vue-context';
import { Team } from '@/api/models/Team';
import { Player } from '@/api/models/Player';

@Component({
  components: {
    MemberItem,
    VueContext,
  },
})
export default class MemberList extends Vue {
  @teamModule.State teamInfo!: Team;
  @teamModule.State teamMembers!: Player[];
  @authModule.State profile!: Player;
  @Ref() menu!: any;

  @Emit()
  kickMember(id: string): string {
    return id;
  }

  @Emit()
  updateColor(payload: { _id: string; color: string }) {
    return payload;
  }

  @Emit()
  transferManager(to: string): string {
    return to;
  }

  // TODO: sort online members to be first
  get sortedMembers() {
    return this.teamMembers.sort((a, b) => new Date(b.lastOnline!).getTime() - new Date(a.lastOnline!).getTime());
  }
}
