import { Component, Vue } from 'vue-property-decorator';
import RegisterForm from '@/components/RegisterForm/RegisterForm.vue';
import { Routes } from '@/router/router.models';
import { appModule, authModule } from '@/store/namespaces';
import { Response } from '@/store';
import { catchPromise } from '@/utils/catchPromise';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';

@Component({
  components: {
    RegisterForm,
  },
})
export default class RegisterView extends Vue {
  @authModule.Action private register!: (formData: FormData) => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;
  private formError = '';

  // TODO: remove when key system is removed
  private mounted() {
    console.log(
      `%cHey there, looks like you're a developer checking out stratbook! If you find any bugs or just want help to improve stratbook, feel free to open issues and submit PR's on Github: https://github.com/JH1ller/csgo-stratbook`,
      `color: #c3c3c3; background: #141418; border: 1px solid #9fd1ff; border-right: none; padding: 2px 8px;`
    );
  }

  private async registerRequest(formData: FormData) {
    const res = await this.register(formData);
    if (res.error) {
      this.updateFormError(res.error);
    } else if (res.success) {
      this.updateFormError('');
      this.$router.push(Routes.Login);

      // TODO: remove once hotmail issue is resolved.
      // * checks if registered email is microsoft email
      const email = formData.get('email') as string;
      if (['@hotmail', '@live', '@outlook'].some((suffix) => email.includes(suffix))) {
        catchPromise(
          this.showDialog({
            key: 'register-view/hotmail-warning',
            text: `Hey there, glad to have you on board!<br>It seems like you registered with a Microsoft email.<br>The confirmation mail might land in your spam folder or not arrive at all.<br>If that's the case, please contact me at support@stratbook.live`,
            resolveBtn: 'OK',
            htmlMode: true,
            confirmOnly: true,
          })
        );
      }
    }
  }

  private updateFormError(text: string): void {
    this.formError = text;
  }
}
