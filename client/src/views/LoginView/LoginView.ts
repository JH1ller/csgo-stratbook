import { Component, Vue, Ref } from 'vue-property-decorator';
import LoginForm from '@/components/LoginForm/LoginForm.vue';
import { Response } from '@/services/models';
import { authModule } from '@/store/namespaces';
import { Routes } from '@/router/router.models';

@Component({
  components: {
    LoginForm,
  },
})
export default class LoginView extends Vue {
  @authModule.Action login!: (credentials: { email: string; password: string }) => Promise<Response>;
  private formError: string = '';

  private async loginRequest(payload: any) {
    const res = await this.login({
      email: payload.email,
      password: payload.password,
    });
    if (res.error) {
      this.updateFormError(res.error);
    } else if (res.success) {
      this.updateFormError('');
      this.$router.push(Routes.JoinTeam);
    }
  }

  private updateFormError(text: string): void {
    this.formError = text;
  }
}
