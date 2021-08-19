import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import TextInput from '@/components/TextInput/TextInput';
import ImageUploader from '@/components/ImageUploader/ImageUploader';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog';
import { isEmptyIterable } from '@/utils/isEmptyIterable';
import FormField from '@/utils/FormField';
import { validateForm, Validators } from '@/utils/validation';
import { Team } from '@/api/models/Team';

@Component({
  components: {
    TextInput,
    ImageUploader,
    BackdropDialog,
  },
})
export default class EditTeamForm extends Vue {
  @Prop() teamInfo!: Team;

  private formFields: Record<string, FormField> = {
    name: new FormField('Name', false, []),
    website: new FormField('Website', false, [Validators.isURL()]),
    serverIp: new FormField('Server IP', false, []),
    serverPw: new FormField('Password', false, []),
  };

  private files: File[] = [];

  private mounted() {
    this.mapToFields();
  }

  @Watch('profile')
  private profileUpdated() {
    this.mapToFields();
  }

  private mapToFields() {
    this.formFields.name.value = this.teamInfo.name;
    this.formFields.website.value = this.teamInfo.website || '';
    this.formFields.serverIp.value = this.teamInfo.server?.ip || '';
    this.formFields.serverPw.value = this.teamInfo.server?.password || '';
  }

  private handleSubmit() {
    if (validateForm(this.formFields)) {
      this.submit();
    }
  }

  @Emit()
  private cancel() {
    //
  }

  private submit() {
    const requestFormData = new FormData();

    if (this.files.length) {
      requestFormData.append('avatar', this.files[0], this.files[0].name);
    }

    for (const [key, data] of Object.entries(this.formFields)) {
      if (data.value && data.value !== this.teamInfo[key as keyof Team]) {
        requestFormData.append(key, data.value);
      }
    }

    if (!isEmptyIterable(requestFormData.keys())) this.$emit('submit', requestFormData);
  }
}
