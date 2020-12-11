import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import TextInput from '@/components/TextInput/TextInput.vue';
import { Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';

@Component({
  components: {
    TextInput,
  },
})
export default class ForgotPasswordForm extends Vue {
  @Prop() formError!: string;

  private email: FormField = new FormField('Email', true, [Validators.notEmpty(), Validators.isEmail()], 'email');

  private submitClicked() {
    if (this.email.validate()) {
      this.submit();
    }
  }

  @Emit()
  private submit() {
    return this.email.value;
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }
}
