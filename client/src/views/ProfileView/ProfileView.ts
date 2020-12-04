import { Component, Vue } from 'vue-property-decorator';
import { Routes } from '@/router/router.models';
import { authModule } from '@/store/namespaces';
import StratEditor from '@/components/StratEditor/StratEditor.vue';

@Component({
  components: {
    StratEditor
  },
})
export default class ProfileView extends Vue {
  @authModule.Action private logout!: () => Promise<void>;

  private async logoutRequest() {
    await this.logout();
    this.$router.push(Routes.Login);
  }
}
