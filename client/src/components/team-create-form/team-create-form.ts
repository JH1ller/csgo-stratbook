import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import { FormComponent } from '@/interfaces/index';
export interface TeamCreateFormData {
  name: string;
}

@Component({})
export default class TeamCreateForm extends Vue implements FormComponent {
  @Ref('file-input') fileInput!: HTMLInputElement;
  @Ref('name') nameInput!: HTMLInputElement;
  @Ref('password') passwordInput!: HTMLInputElement;
  private formMessage: string | null = null;
  private formMessageStyle: string | null = null;

  private formData: TeamCreateFormData = {
    name: '',
  };
  private imageFile: File | null = null;

  get isError() {
    return this.formMessageStyle === 'error';
  }

  get isSuccess() {
    return this.formMessageStyle === 'success';
  }

  private fileSelected(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.imageFile = file;
      this.fileInput.setAttribute('file-input-value', file.name.slice(-30));
    }
  }

  private validateForm(): boolean {
    if (this.nameInput.value.length < 3 || this.nameInput.value.length > 20) {
      this.updateFormMessage(
        'Team name must be between 3 and 24 characters.',
        'error'
      );
      return false;
    }
    return true;
  }

  private createClicked(e: Event) {
    e.preventDefault();

    if (!this.validateForm()) return;

    let requestFormData = new FormData();
    if (this.imageFile) {
      requestFormData.append('avatar', this.imageFile, this.imageFile.name);
    }

    for (let [key, value] of Object.entries(this.formData)) {
      requestFormData.append(key, value);
    }
    this.$emit('create-clicked', requestFormData);
  }

  public updateFormMessage(message: string | null, style: string | null) {
    this.formMessage = message;
    this.formMessageStyle = style;
  }
}
