import { Sides } from '@/api/models/Sides';
import { Strat } from '@/api/models/Strat';
import { StratTypes } from '@/api/models/StratTypes';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import TypePicker from '@/components/TypePicker/TypePicker.vue';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import FormFieldSet from '@/components/FormFieldSet/FormFieldSet.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import { FormFieldData, validate, Validators } from '@/utils/validation';

@Component({
  components: {
    SidePicker,
    BackdropDialog,
    TextInput,
    TypePicker,
    FormFieldSet,
  },
})
export default class StratForm extends Vue {
  @Prop() strat!: Strat;
  @Prop() isEdit!: boolean;

  private formFields: Record<string, FormFieldData> = {
    name: {
      label: 'Name',
      required: true,
      value: '',
      hasError: false,
      autocompleteTag: '',
      validators: [Validators.notEmpty(), Validators.maxLength(50)],
    },
    note: {
      label: 'Note',
      required: false,
      value: '',
      hasError: false,
      autocompleteTag: '',
      validators: [Validators.maxLength(100)],
    },
    videoLink: {
      label: 'Video Link',
      required: false,
      value: '',
      hasError: false,
      autocompleteTag: '',
      validators: [Validators.maxLength(100), Validators.isURL()],
    },
  };

  private type: StratTypes = StratTypes.BUYROUND;
  private side: Sides = Sides.T;

  private mounted() {
    if (this.strat && this.isEdit) {
      this.mapToFields();
    }
  }

  private submitClicked() {
    if (this.isValid()) {
      this.submitStrat();
    }
  }

  @Emit()
  private submitStrat(): Partial<Strat> {
    return {
      _id: this.isEdit ? this.strat._id : undefined,
      name: this.formFields.name.value,
      type: this.type,
      side: this.side,
      note: this.formFields.note.value,
      videoLink: this.formFields.videoLink.value,
    };
  }

  @Emit()
  private cancelClicked() {
    return;
  }

  private isValid(): boolean {
    let valid = true;

    const fields = Object.entries(this.formFields);

    fields.forEach(([fieldName, fieldData]) => {
      if (!validate(fieldData)) {
        valid = false;
        this.formFields[fieldName].hasError = true;
      }
    });

    return valid;
  }

  private mapToFields() {
    this.formFields.name.value = this.strat.name;
    this.formFields.note.value = this.strat.note ?? '';
    this.formFields.videoLink.value = this.strat.videoLink ?? '';
    this.type = this.strat.type;
    this.side = this.strat.side;
  }
}
