import { Component, Vue, Ref } from 'vue-property-decorator';
import LoginForm from '@/components/login-form/login-form.vue';
import { ILoginForm } from '@/components/login-form/login-form';

@Component({
  name: 'LoginView',
  components: {
    LoginForm,
  },
})
export default class LoginView extends Vue {
  @Ref('login-form') loginForm!: ILoginForm;
  private showRegisterForm = false;

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
}
