import FormField from '@/utils/FormField';
import { validateForm, Validators } from '@/utils/validation';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import TextInput from '@/components/TextInput/TextInput.vue';

@Component({
  components: {
    ImageUploader,
    TextInput,
  },
})
export default class RegisterForm extends Vue {
  @Prop() formError!: string;

  private formFields: Record<string, FormField> = {
    name: new FormField('Username', true, [Validators.notEmpty(), Validators.minLength(2), Validators.maxLength(20)]),
    email: new FormField('Email', true, [Validators.notEmpty(), Validators.isEmail()]),
    password: new FormField('Password', true, [Validators.notEmpty(), Validators.minLength(8)]),
    key: new FormField('Beta Key', true, [Validators.notEmpty(), Validators.exactLength(20)]),
  };

  private passwordRepeat = new FormField('Repeat password', true, [
    Validators.notEmpty(),
    Validators.matches(this.formFields.password),
  ]);

  private files: File[] = [];

  private handleSubmit() {
    if (validateForm(this.formFields) && this.passwordRepeat.validate()) {
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
