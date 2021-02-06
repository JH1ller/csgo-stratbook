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
  private formError = '';

  // TODO: remove when key system is removed
  private mounted() {
    console.log(
      `%cHey there, looks like you're a developer checking out stratbook! If you want to have a deeper look, here is a free beta key: %c66D7B36A836090EBB985`,
      `color: #c3c3c3; background: #141418; border: 1px solid #9fd1ff; border-right: none; padding: 2px 8px;`,
      `color: #41b883; background: #141418; border: 1px solid #41b883; padding: 2px 8px;`
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
