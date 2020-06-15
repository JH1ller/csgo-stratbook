import { Component, Vue, Ref } from 'vue-property-decorator';

@Component({ name: 'ProfileView' })
export default class ProfileView extends Vue {
  private async logoutRequest(payload: any) {
    const res = await this.$store.dispatch('logoutUser');
    if (res) this.$router.push({ name: 'Login' });
  }
}
