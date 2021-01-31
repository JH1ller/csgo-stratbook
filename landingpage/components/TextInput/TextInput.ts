import FormField from '@/utils/FormField';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class TextInput extends Vue {
  @Prop() field!: FormField;
  @Prop() name!: string | undefined;
  @Prop({ default: 'text' }) type!: string;

  @Emit()
  private input(e: InputEvent) {
    return (e.target as HTMLInputElement).value;
  }

  @Emit()
  private focus() {
    return;
  }

  private get formattedLabel() {
    return this.field.required ? `${this.field.label}*` : this.field.label;
  }
}
