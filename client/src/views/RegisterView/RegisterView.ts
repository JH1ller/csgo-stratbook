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
  @authModule.Action private register!: (formData: FormData) => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  private formError = '';

  // TODO: remove when key system is removed
  private mounted() {
    console.log(
      `%cHey there, looks like you're a developer checking out stratbook! If you find any bugs or just want help to improve stratbook, feel free to open issues and submit PR's on Github: https://github.com/JH1ller/csgo-stratbook`,
      `color: #c3c3c3; background: #141418; border: 1px solid #9fd1ff; border-right: none; padding: 2px 8px;`,
    );
  }

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
