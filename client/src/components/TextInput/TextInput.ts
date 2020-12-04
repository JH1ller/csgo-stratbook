import { FormFieldData } from '@/utils/validation';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class TextInput extends Vue {
  @Prop() fieldData!: FormFieldData;
  @Prop() fieldName!: string;

  @Emit()
  private input(e: InputEvent) {
    return (e.target as HTMLInputElement).value;
  }

  @Emit()
  private focus() {
    return;
  }

  private get formattedLabel() {
    return this.fieldData.required ? `${this.fieldData.label}*` : this.fieldData.label;
  }
}
