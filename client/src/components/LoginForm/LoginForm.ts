import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

@Component({})
export default class LoginForm extends Vue {
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
}
