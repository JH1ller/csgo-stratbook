import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const authModule = namespace('auth');

@Component({})
export default class ProfileView extends Vue {
  @authModule.Action private logoutUser!: () => Promise<void>;

  private async logoutRequest() {
    await this.logoutUser();
    this.$router.push({ name: 'Login' });
  }
}
