import { Component, Vue } from 'vue-property-decorator';
import RegisterForm from '@/components/RegisterForm/RegisterForm.vue';
import { Routes } from '@/router/router.models';
import { appModule, authModule } from '@/store/namespaces';
import { Response } from '@/store';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';

@Component({
  components: {
    RegisterForm,
  },
})
export default class RegisterView extends Vue {
  @authModule.Action register!: (formData: FormData) => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  formError = '';

  async registerRequest(formData: FormData) {
    const res = await this.register(formData);
    if (res.error) {
      this.updateFormError(res.error);
    } else if (res.success) {
      this.updateFormError('');
      this.$router.push(Routes.Login);
    }
  }

  updateFormError(text: string): void {
    this.formError = text;
  }
}
