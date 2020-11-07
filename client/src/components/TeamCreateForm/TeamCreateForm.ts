import { Component, Vue, Ref, Prop, Emit } from 'vue-property-decorator';
export interface TeamCreateFormData {
  name: string;
  website?: string;
  serverIp?: string;
  serverPw?: string;
  imageFile?: File;
}

@Component({})
export default class TeamCreateForm extends Vue {
  @Ref('file-input') fileInput!: HTMLInputElement;
  @Ref('name') nameInput!: HTMLInputElement;
  @Ref('website') websiteInput!: HTMLInputElement;
  @Ref('server') serverInput!: HTMLInputElement;

  @Prop() formError!: string;

  private formData: TeamCreateFormData = {
    name: '',
    website: '',
    serverIp: '',
    serverPw: '',
  };
  private imageFile: File | null = null;

  private fileSelected(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.imageFile = file;
      this.fileInput.setAttribute('file-input-value', file.name.slice(-30));
    }
  }

  private validateForm(): boolean {
    if (this.nameInput.value.length < 3 || this.nameInput.value.length > 20) {
      this.updateFormError('Team name must be between 3 and 24 characters.');
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

    for (const [key, value] of Object.entries(this.formData)) {
      requestFormData.append(key, value);
    }
    this.$emit('create-clicked', requestFormData);
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }
}
