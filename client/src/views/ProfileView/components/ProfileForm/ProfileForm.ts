import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TextInput from '@/components/TextInput/TextInput.vue';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import { Player } from '@/api/models/Player';
import { isEmptyIterable } from '@/utils/isEmptyIterable';
import FormField from '@/utils/FormField';
import { Validators } from '@/utils/validation';

@Component({
  components: {
    TextInput,
    ImageUploader,
  },
})
export default class ProfileForm extends Vue {
  @Prop() profile!: Player;

  formFields: Record<string, FormField> = {
    name: new FormField('Name', false, []),
    email: new FormField('Email', false, []),
    password: new FormField('New password', false, []),
  };

  repeatField = new FormField('Repeat new password', false, [Validators.matches(this.formFields.password)]);

  // * array because ImageUploader component expects array here, although limit is 1
  files: File[] = [];

  mounted() {
    this.mapToFields();
  }

  @Watch('profile')
  profileUpdated() {
    this.mapToFields();
  }

  mapToFields() {
    this.formFields.name.value = this.profile.name;
    this.formFields.email.value = this.profile.email;
    this.formFields.password.value = '';
    this.repeatField.value = '';
    this.files = [];
  }

  handleSubmit() {
    if (this.repeatField.validate()) {
      this.submit();
    }
  }

  submit() {
    const requestFormData = new FormData();

    if (this.files.length) {
      requestFormData.append('avatar', this.files[0], this.files[0].name);
    }

    for (const [key, data] of Object.entries(this.formFields)) {
      if (data.value && data.value !== this.profile[key as keyof Player]) {
        requestFormData.append(key, data.value);
      }
    }

    if (!isEmptyIterable(requestFormData.keys())) this.$emit('submit', requestFormData);
  }

  get submitEnabled() {
    return (
      (this.formFields.name.value && this.formFields.name.value !== this.profile.name) ||
      (this.formFields.email.value && this.formFields.email.value !== this.profile.email) ||
      this.files.length > 0 ||
      this.formFields.password.value.length > 0
    );
  }
}
