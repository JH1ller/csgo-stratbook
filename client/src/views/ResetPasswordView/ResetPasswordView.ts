import { Component, Vue } from 'vue-property-decorator';
import ResetPasswordForm from './components/ResetPasswordForm/ResetPasswordForm.vue';
import { Response } from '@/store';
import { authModule } from '@/store/namespaces';
import { Routes } from '@/router/router.models';

@Component({
  components: {
    ResetPasswordForm,
  },
})
export default class ResetPasswordView extends Vue {
  @authModule.Action resetPassword!: (payload: { token: string; password: string }) => Promise<Response>;
  private formError = '';

  private async resetPasswordRequest(payload: { token: string; password: string }) {
    const res = await this.resetPassword(payload);
    if (res.error) {
      this.updateFormError(res.error);
    } else if (res.success) {
      this.updateFormError('');
      this.$router.push(Routes.Login);
    }
  }

  private updateFormError(text: string): void {
    this.formError = text;
  }
}
