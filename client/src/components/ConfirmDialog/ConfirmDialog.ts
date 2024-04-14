import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class ConfirmDialog extends Vue {
  @Prop() text!: string;
  @Prop() resolve!: (value: boolean) => void;
  @Prop({ default: 'Confirm' }) resolveBtn!: string;
  @Prop({ default: 'Cancel' }) rejectBtn!: string;
  @Prop({ default: false }) confirmOnly!: boolean;
  @Prop({ default: false }) htmlMode!: boolean;

  confirmClicked() {
    this.resolve(true);
    this.close();
  }

  cancelClicked() {
    this.resolve(false);
    this.close();
  }

  @Emit()
  close() {
    return;
  }
}
