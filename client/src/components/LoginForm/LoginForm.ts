import { appModule } from '@/store/namespaces';
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Toast } from '../ToastWrapper/ToastWrapper.models';

@Component({})
export default class LoginForm extends Vue {
  @appModule.Action private showToast!: (toast: Toast) => void;

  private email: string = '';
  private password: string = '';
  @Prop() formError!: string;

  @Emit()
  private loginClicked(e: Event) {
    e.preventDefault();
    return { email: this.email, password: this.password };
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }

  private mounted() {
    const email = this.$route.query.confirmed ?? this.$route.query.already_confirmed;
    if (email) {
      this.showToast({ id: 'loginForm/emailConfirmed', 
        text: this.$route.query.already_confirmed 
          ? 'You email has already been confirmed.'
          : 'Your email has been confirmed. You can now login and start creating strats!'
      });
      this.email = email as string;
    }
  }
}
