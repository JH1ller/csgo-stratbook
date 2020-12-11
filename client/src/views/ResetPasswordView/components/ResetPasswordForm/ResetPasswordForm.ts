import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import TextInput from '@/components/TextInput/TextInput.vue';
import { Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';
import { RouteNames } from '@/router/router.models';

@Component({
  components: {
    TextInput,
  },
})
export default class ResetPasswordForm extends Vue {
  @Prop() formError!: string;

  private password: FormField = new FormField('New password', true, [Validators.notEmpty(), Validators.minLength(8)]);
  private repeatPassword: FormField = new FormField('Repeat new password', true, [
    Validators.notEmpty(),
    Validators.matches(this.password),
  ]);
  private token!: string;

  private submitClicked() {
    if (this.password.validate() && this.repeatPassword.validate()) {
      this.submit();
    }
  }

  private mounted() {
    const token = this.$route.query.token;
    if (token) {
      this.token = token as string;
    } else {
      this.$router.push({ name: RouteNames.Login });
    }
  }

  @Emit()
  private submit() {
    return { token: this.token, password: this.password.value };
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }
}
