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
  updateColor(color: string): string {
    return color;
  }

  @Emit()
  transferManager(to: string): string {
    return to;
  }

  openMenu({ event, member }: { event: MouseEvent; member: Player }): void {
    if (this.shouldShowMenu(member)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.menu.open(event, { member });
    }
  }

  get isManager(): boolean {
    return this.teamInfo.manager === this.profile._id;
  }

  shouldShowMenu(member: Player): boolean {
    return (
      (this.isManager && member._id !== this.teamInfo.manager) ||
      (this.isManager && member._id !== this.profile._id) ||
      member._id === this.profile._id
    );
  }

  get sortedMembers() {
    return this.teamMembers.sort((a, b) => new Date(b.lastOnline!).getTime() - new Date(a.lastOnline!).getTime());
  }
}
