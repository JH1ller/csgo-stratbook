import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import TextInput from '@/components/TextInput/TextInput';
import FormField from '@/utils/FormField';
import { Validators } from '@/utils/validation';
@Component({
  components: {
    TextInput,
  },
})
export default class JoinTeamForm extends Vue {
  @Prop() private formError!: string;
  private code = new FormField('Code', true, [Validators.exactLength(6)]);

  @Emit()
  private updateFormError(text: string) {
    return text;
  }

  @Emit()
  private submit() {
    return this.code.value.toLowerCase();
  }

  private joinClicked() {
    if (this.code.validate()) {
      this.submit();
    }
  }
}
