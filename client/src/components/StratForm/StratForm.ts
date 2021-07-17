import { Sides } from '@/api/models/Sides';
import { Strat } from '@/api/models/Strat';
import { StratTypes } from '@/api/models/StratTypes';
import { Component, Prop, Vue, Emit, Mixins } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import TypePicker from '@/components/TypePicker/TypePicker.vue';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import FormFieldSet from '@/components/FormFieldSet/FormFieldSet.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import { validateForm, Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';
import CloseOnEscape from '@/mixins/CloseOnEscape';

@Component({
  components: {
    SidePicker,
    BackdropDialog,
    TextInput,
    TypePicker,
    FormFieldSet,
  },
})
export default class StratForm extends Mixins(CloseOnEscape) {
  @Prop() strat!: Strat;
  @Prop() isEdit!: boolean;

  private formFields: Record<string, FormField> = {
    name: new FormField('Name', true, [Validators.notEmpty(), Validators.maxLength(50)]),
    note: new FormField('Note', false, [Validators.maxLength(100)]),
    videoLink: new FormField('Video Link', false, [Validators.isURL()]),
  };

  private types: StratTypes[] = [StratTypes.BUYROUND];
  private side: Sides = Sides.T;

  private mounted() {
    if (this.strat && this.isEdit) {
      this.mapToFields();
    }
  }

  private handleSubmit() {
    if (validateForm(this.formFields)) {
      this.submitStrat();
    }
  }

  @Emit()
  private submitStrat(): Partial<Strat> {
    return {
      _id: this.isEdit ? this.strat._id : undefined,
      name: this.formFields.name.value,
      types: this.types,
      side: this.side,
      note: this.formFields.note.value,
      videoLink: this.formFields.videoLink.value,
    };
  }

  private mapToFields() {
    this.formFields.name.value = this.strat.name;
    this.formFields.note.value = this.strat.note ?? '';
    this.formFields.videoLink.value = this.strat.videoLink ?? '';
    this.types = this.strat.types;
    this.side = this.strat.side;
  }
}
