import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
@Component({})
export default class RegisterForm extends Vue {
  @Ref('file-input') fileInput!: HTMLInputElement;
  @Ref('name') nameInput!: HTMLInputElement;
  @Ref('email') emailInput!: HTMLInputElement;
  @Ref('password') passwordInput!: HTMLInputElement;
  @Ref('password-repeat') passwordRepeatInput!: HTMLInputElement;
  @Prop() formError!: string;

  private formData: RegisterFormData = {
    name: '',
    email: '',
    password: '',
  };
  private imageFile: File | null = null;
  private pwRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/);

  private fileSelected(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.imageFile = file;
      this.fileInput.setAttribute('file-input-value', file.name.slice(-30));
    }
  }

  private validateForm(): boolean {
    if (this.nameInput.value.length < 3 || this.nameInput.value.length > 20) {
      this.updateFormError('Name must be between 3 and 20 characters.');
      return false;
    }
    if (this.emailInput.value.length < 6 || !this.emailInput.checkValidity()) {
      this.updateFormError('Please enter a valid email address.');
      return false;
    }
    if (!this.pwRegex.test(this.passwordInput.value)) {
      this.updateFormError(
        'Password must be at least 8 characters long and contain uppercase, lowercase and number characters.'
      );
      return false;
    }
    if (this.passwordRepeatInput.value !== this.passwordInput.value) {
      this.updateFormError('Passwords don\'t match.');
      return false;
    }
    return true;
  }

  private registerClicked(e: Event) {
    e.preventDefault();

    if (!this.validateForm()) return;

    let requestFormData = new FormData();
    if (this.imageFile) {
      requestFormData.append('avatar', this.imageFile, this.imageFile.name);
    }

    for (const [key, value] of Object.entries(this.formData)) {
      requestFormData.append(key, value);
    }
    this.$emit('register-clicked', requestFormData);
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }
}
