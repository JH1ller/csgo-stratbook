import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
@Component({
  components: {},
})
export default class RegisterForm extends Vue {
  private formData: RegisterFormData = {
    name: 'test1',
    email: 'test1@mail.com',
    password: 'Wdawdawd123',
  };
  private imageFile: File | null = null;
  @Prop() formMessage!: string | null;
  @Prop() formMessageStyle!: string | null;

  get isError() {
    return this.formMessageStyle === 'error';
  }

  get isSuccess() {
    return this.formMessageStyle === 'success';
  }

  private fileSelected(e: any) {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      this.imageFile = e.target.files[0];
    }
  }

  @Emit()
  private registerClicked(e: Event) {
    e.preventDefault();
    let requestFormData = new FormData();
    if (this.imageFile) {
      requestFormData.append('avatar', this.imageFile, this.imageFile.name);
    }

    for (let [key, value] of Object.entries(this.formData)) {
      requestFormData.append(key, value);
    }

    return requestFormData;
  }
}
