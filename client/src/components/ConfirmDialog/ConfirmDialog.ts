import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class ConfirmDialog extends Vue {
  @Prop() text!: string;
  @Prop() resolve!: (result: boolean) => void;
  @Prop({ default: 'Confirm' }) resolveBtn!: string;
  @Prop({ default: 'Cancel' }) rejectBtn!: string;
  @Prop({ default: false }) confirmOnly!: boolean;
  @Prop({ default: false }) htmlMode!: boolean;

  private confirmClicked() {
    this.resolve(true);
    this.close();
  }

  private cancelClicked() {
    this.resolve(false);
    this.close();
  }

  @Emit()
  private close() {
    //
  }
}
