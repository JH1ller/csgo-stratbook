import { Component, Vue, Ref } from 'vue-property-decorator';
import LoginForm from '@/components/login-form/login-form.vue';
import { FormComponent } from '@/interfaces';
import { Response } from '@/services/models';
import { authModule } from '@/store/namespaces';

@Component({
  components: {
    LoginForm,
  },
})
export default class LoginView extends Vue {
  @Ref('login-form') loginForm!: FormComponent;
  @authModule.Action login!: (credentials: { email: string; password: string }) => Promise<Response>;

  private async loginRequest(payload: any) {
    const res = await this.login({
      email: payload.email,
      password: payload.password,
    });
    if (res.error) {
      this.loginForm.updateFormMessage(res.error, 'error');
    } else if (res.success) {
      this.loginForm.updateFormMessage(res.success, 'success');
      setTimeout(() => {
        this.loginForm.updateFormMessage(null, null);
        this.$router.push({ name: 'Strats', query: { toast: 'false' } });
      }, 3000);
    }
  }
}
