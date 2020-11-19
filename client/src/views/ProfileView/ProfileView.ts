import { Component, Ref, Vue } from 'vue-property-decorator';
import { Routes } from '@/router/router.models';
import { authModule, teamModule } from '@/store/namespaces';
import { Player } from '@/api/models';
import StratEditor from '@/components/StratEditor/StratEditor.vue';

@Component({
  components: {
    StratEditor
  },
})
export default class ProfileView extends Vue {
  @authModule.Action private logout!: () => Promise<void>;
  @teamModule.State private teamMembers!: Player[];

  private async logoutRequest() {
    await this.logout();
    this.$router.push(Routes.Login);
  }
}
