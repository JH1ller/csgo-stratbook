import { Component, Vue, Ref } from 'vue-property-decorator';
import RegisterForm from '@/components/register-form/register-form.vue';
import { RegisterFormData } from '@/components/register-form/register-form';

@Component({
  name: 'RegisterView',
  components: {
    RegisterForm,
  },
})
export default class RegisterView extends Vue {
  private formMessage: string | null = null;
  private formMessageStyle: string | null = null;

  private async registerRequest(formData: RegisterFormData) {
    const res = await this.$store.dispatch('registerUser', formData);
    if (res.error) {
      this.formMessage = res.error;
      this.formMessageStyle = 'error';
    } else if (res.success) {
      this.formMessage = res.success;
      this.formMessageStyle = 'success';
      setTimeout(() => {
        this.formMessage = null;
        this.formMessageStyle = null;
        this.$router.push({ name: 'Login' });
      }, 3000);
    }
  }
}
