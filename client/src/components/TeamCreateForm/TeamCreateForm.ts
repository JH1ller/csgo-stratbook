import FormField from '@/utils/FormField';
import TextInput from '@/components/TextInput/TextInput';
import ImageUploader from '@/components/ImageUploader/ImageUploader';
import { validateForm, Validators } from '@/utils/validation';
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component({
  components: {
    TextInput,
    ImageUploader,
  },
})
export default class TeamCreateForm extends Vue {
  @Prop() formError!: string;

  private formFields: Record<string, FormField> = {
    name: new FormField('Team name', true, [Validators.notEmpty(), Validators.minLength(3), Validators.maxLength(24)]),
    website: new FormField('Website', false, [Validators.isURL()]),
    serverIp: new FormField('Server IP', false, [Validators.minLength(3), Validators.maxLength(200)]),
    serverPw: new FormField('Password', false, []),
  };

  private files: File[] = [];

  private createClicked() {
    if (validateForm(this.formFields)) {
      this.submit();
    }
  }

  @Emit()
  private submit() {
    const requestFormData = new FormData();

    if (this.files.length) {
      requestFormData.append('avatar', this.files[0], this.files[0].name);
    }

    for (const [key, data] of Object.entries(this.formFields)) {
      requestFormData.append(key, data.value);
    }

    return requestFormData;
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }
}
