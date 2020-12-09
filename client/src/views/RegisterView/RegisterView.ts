import { Component, Vue } from 'vue-property-decorator';
import RegisterForm from '@/components/RegisterForm/RegisterForm.vue';
import { Routes } from '@/router/router.models';
import { authModule } from '@/store/namespaces';
import { Response } from '@/store';

@Component({
  components: {
    RegisterForm,
  },
})
export default class RegisterView extends Vue {
  @authModule.Action private register!: (formData: FormData) => Promise<Response>;
  private formError: string = '';

  private async registerRequest(formData: FormData) {
    const res = await this.register(formData);
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
