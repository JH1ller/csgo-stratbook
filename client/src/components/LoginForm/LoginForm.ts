import { appModule } from '@/store/namespaces';
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import TextInput from '@/components/TextInput/TextInput.vue';
import { Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';
@Component({
  components: {
    TextInput,
  },
})
export default class LoginForm extends Vue {
  @appModule.Action showToast!: (toast: Toast) => void;
  @Prop() formError!: string;

  email: FormField = new FormField('Email', true, [Validators.notEmpty(), Validators.isEmail()], 'email');

  password: FormField = new FormField('Password', true, [Validators.notEmpty()], 'password');

  handleSubmit() {
    if (this.email.validate() && this.password.validate()) {
      this.submit();
    }
  }

  @Emit()
  resetPassword() {
    return;
  }

  @Emit()
  submit() {
    return { email: this.email.value, password: this.password.value };
  }

  @Emit()
  steamLogin() {
    return;
  }

  @Emit()
  updateFormError(text: string) {
    return text;
  }

  mounted() {
    const email = this.$route.query.confirmed ?? this.$route.query.already_confirmed;
    if (email) {
      this.showToast({
        id: 'loginForm/emailConfirmed',
        text: this.$route.query.already_confirmed
          ? 'You email has already been confirmed.'
          : 'Your email has been confirmed. You can now login and start creating strats!',
      });
      this.email.value = email as string;
    }
  }
}
