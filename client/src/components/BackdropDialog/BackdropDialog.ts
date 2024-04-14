import CloseOnEscape from '@/mixins/CloseOnEscape';
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator';

@Component({})
export default class BackdropDialog extends Mixins(CloseOnEscape) {
  @Prop({ default: false }) fullscreen!: boolean;

  @Emit()
  close(): void {
    return;
  }
}
