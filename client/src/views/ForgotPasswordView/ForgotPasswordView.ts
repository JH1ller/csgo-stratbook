import { Component, Vue } from 'vue-property-decorator';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm.vue';
import { Response } from '@/store';
import { authModule } from '@/store/namespaces';

@Component({
  components: {
    ForgotPasswordForm,
  },
})
export default class ForgotPasswordView extends Vue {
  @authModule.Action forgotPassword!: (email: string) => Promise<Response>;
  private formError: string = '';

  private async forgotPasswordRequest(email: string) {
    const res = await this.forgotPassword(email);
    if (res?.error) {
      this.updateFormError(res.error);
    }
  }

  private updateFormError(text: string): void {
    this.formError = text;
  }
}
