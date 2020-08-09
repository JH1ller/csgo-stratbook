import { Component, Vue, Emit } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class LoginForm extends Vue {
  private email: string = '';
  private password: string = '';
  private formMessage: string | null = null;
  private formMessageStyle: string | null = null; // TODO: refactor to enum

  get isError() {
    return this.formMessageStyle === 'error';
  }

  get isSuccess() {
    return this.formMessageStyle === 'success';
  }

  @Emit()
  private loginClicked(e: Event) {
    e.preventDefault();
    return { email: this.email, password: this.password };
  }

  public updateFormMessage(message: string | null, style: string | null) {
    this.formMessage = message;
    this.formMessageStyle = style;
  }
}
