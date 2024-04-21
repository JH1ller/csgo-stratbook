import { Component, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/LoginForm/LoginForm.vue';
import { Response } from '@/store';
import { authModule } from '@/store/namespaces';
import { Routes } from '@/router/router.models';
import api from '@/api/base';
import { openLink } from '@/utils/openLink';

@Component({
  components: {
    LoginForm,
  },
})
export default class LoginView extends Vue {
  @authModule.Action login!: (credentials: { email: string; password: string }) => Promise<Response>;
  formError: string = '';

  async loginRequest(payload: { email: string; password: string }) {
    const res = await this.login({
      email: payload.email,
      password: payload.password,
    });
    if (res.error) {
      this.updateFormError(res.error);
    } else if (res.success) {
      this.updateFormError('');
      this.$router.push(Routes.JoinTeam).catch((error) => console.warn(error.message));
    }
  }

  updateFormError(text: string): void {
    this.formError = text;
  }

  async loginWithSteam() {
    const { success } = await api.auth.fetchSteamUrl();
    if (success) {
      if (window.desktopMode) {
        openLink(success);
      } else {
        window.location.href = success;
      }
    }
  }
}
