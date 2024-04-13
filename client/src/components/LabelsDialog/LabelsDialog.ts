import CloseOnEscape from '@/mixins/CloseOnEscape';
import { stratModule } from '@/store/namespaces';
import { Component, Emit, Mixins, Vue } from 'vue-property-decorator';

@Component({
  components: {
    BackdropDialog: () => import('../BackdropDialog/BackdropDialog.vue'),
  },
})
export default class LabelsDialog extends Mixins(CloseOnEscape) {
  @stratModule.State readonly labels!: string[];

  newLabelName: string = '';

  @Emit()
  add(): void {
    return;
  }

  @Emit()
  close(): void {
    return;
  }
}
