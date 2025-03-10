import { Component, Emit, Inject, Prop, Vue } from 'vue-property-decorator';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import ago from 's-ago';
import { Player } from '@/api/models/Player';
import { Team } from '@/api/models/Team';
import VSwatches from 'vue-swatches';
import { COLORS } from '@/constants/colors';
import { AccessRole } from '@/api/models/AccessRoles';
import Checkbox from '@/components/Checkbox/Checkbox.vue';
import StorageService from '@/services/storage.service';

@Component({
  components: {
    VSwatches,
    Checkbox,
  },
})
export default class MemberItem extends Vue {
  @Inject() storageService!: StorageService;
  @Prop() member!: Player;
  @Prop() teamMembers!: Player[];
  @Prop() profile!: Player;
  @Prop() teamInfo!: Team;

  swatches = COLORS;
  AccessRole = AccessRole;
  rolesEnabled = true;

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
  updateRole(payload: { _id: string; role: AccessRole }) {
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

  get steamProfileUrl() {
    return this.member.steamId ? `https://steamcommunity.com/profiles/${this.member.steamId}` : undefined;
  }

  mounted() {
    // this.rolesEnabled = this.storageService.get('roles-enabled') === true;
  }
}
