import CloseOnEscape from '@/mixins/CloseOnEscape';
import { stratModule } from '@/store/namespaces';
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator';

@Component({
  components: {
    BackdropDialog: () => import('../BackdropDialog/BackdropDialog.vue'),
  },
})
export default class LabelsDialog extends Mixins(CloseOnEscape) {
  @stratModule.Getter readonly allLabels!: string[];
  @Prop() readonly stratLabels!: string[];

  get otherLabels(): string[] {
    return this.allLabels.filter((label) => !this.stratLabels.includes(label));
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
