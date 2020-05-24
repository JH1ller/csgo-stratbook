import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class LoginForm extends Vue {
  private email: string = '';
  private password: string = '';
  @Prop() formMessage!: string | null;
  @Prop() formMessageStyle!: string | null;

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
}
