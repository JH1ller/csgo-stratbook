import CloseOnEscape from '@/mixins/CloseOnEscape';
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator';

@Component({
  components: {
    BackdropDialog: () => import('../BackdropDialog/BackdropDialog.vue'),
  },
})
export default class LabelsDialog extends Mixins(CloseOnEscape) {
  @Prop() readonly allLabels!: string[];
  @Prop() readonly currentLabels!: string[];

  get otherLabels(): string[] {
    return this.allLabels.filter((label) => !this.currentLabels.includes(label));
  }

  newLabelName: string = '';

  addNew() {
    if (!this.newLabelName) {
      return;
    }

    this.add(this.newLabelName);
    this.newLabelName = '';
  }

  @Emit()
  add(label: string) {
    return label;
  }

  @Emit()
  remove(label: string) {
    return label;
  }

  @Emit()
  close(): void {
    return;
  }
}
