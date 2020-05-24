import { Component, Vue, Ref } from 'vue-property-decorator';
import LoginForm from '@/components/login-form/login-form.vue';
import RegisterForm from '@/components/register-form/register-form.vue';
import { ILoginForm } from '@/components/login-form/login-form';
import { IRegisterForm } from '@/components/register-form/register-form';

@Component({
  name: 'LoginView',
  components: {
    LoginForm,
    RegisterForm,
  },
})
export default class LoginView extends Vue {
  @Ref('login-form') loginForm!: ILoginForm;
  private registerFormVisible = false;

  private async loginRequest(payload: any) {
    const res = await this.$store.dispatch('loginUser', {
      email: payload.email,
      password: payload.password,
    });
    if (res) {
      this.loginForm.displayFormError(res);
    } else {
      this.$router.push({ name: 'Strats' });
    }
  }

  private toggleRegisterForm() {
    this.registerFormVisible = !this.registerFormVisible;
  }
}
