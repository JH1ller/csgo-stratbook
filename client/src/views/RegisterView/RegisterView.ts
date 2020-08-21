import { Component, Vue, Ref } from 'vue-property-decorator';
import RegisterForm from '@/components/register-form/register-form.vue';
import { RegisterFormData } from '@/components/register-form/register-form';
import { FormComponent } from '@/interfaces';
import { namespace } from 'vuex-class';
import { Response } from '@/services/models';
import { Routes } from '@/router/router.models';

const authModule = namespace('auth');

@Component({
  components: {
    RegisterForm,
  },
})
export default class RegisterView extends Vue {
  @Ref('register-form') registerForm!: FormComponent;
  @authModule.Action private register!: (formData: RegisterFormData) => Promise<Response>;

  private async registerRequest(formData: RegisterFormData) {
    const res = await this.register(formData);
    if (res.error) {
      this.registerForm.updateFormMessage(res.error, 'error');
    } else if (res.success) {
      this.registerForm.updateFormMessage(res.success, 'success');
      setTimeout(() => {
        this.registerForm.updateFormMessage(null, null);
        this.$router.push(Routes.Login);
      }, 3000);
    }
  }
}
