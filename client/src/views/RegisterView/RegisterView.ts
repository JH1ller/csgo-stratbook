import { Component, Vue, Ref } from 'vue-property-decorator';
import RegisterForm from '@/components/RegisterForm/RegisterForm.vue';
import { RegisterFormData } from '@/components/RegisterForm/RegisterForm';
import { Response } from '@/services/models';
import { Routes } from '@/router/router.models';
import { authModule } from '@/store/namespaces';

@Component({
  components: {
    RegisterForm,
  },
})
export default class RegisterView extends Vue {
  @authModule.Action private register!: (formData: RegisterFormData) => Promise<Response>;
  private formError: string = '';

  private async registerRequest(formData: RegisterFormData) {
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
