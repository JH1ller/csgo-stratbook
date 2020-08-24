import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Routes } from '@/router/router.models';

const authModule = namespace('auth');

@Component({})
export default class ProfileView extends Vue {
  @authModule.Action private logout!: () => Promise<void>;

  private async logoutRequest() {
    await this.logout();
    this.$router.push(Routes.Login);
  }
}
