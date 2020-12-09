import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class ConfirmDialog extends Vue {
  @Prop() text!: string;
  @Prop() resolve!: () => void;
  @Prop() reject!: () => void;
  @Prop({ default: 'Confirm' }) resolveBtn!: string;
  @Prop({ default: 'Cancel' }) rejectBtn!: string;

  private confirmClicked() {
    this.resolve();
    this.close();
  }

  private cancelClicked() {
    this.reject();
    this.close();
  }

  @Emit()
  private close() {}
}
