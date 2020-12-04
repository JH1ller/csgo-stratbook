import { MouseButtons } from '@/api/models/MouseButtons';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class MouseButtonPicker extends Vue {
  @Prop({ default: MouseButtons.LEFT }) private value!: MouseButtons;
  @Prop({ default: false }) readonly!: boolean;

  private MouseButtons: typeof MouseButtons = MouseButtons;

  @Emit()
  private input() {
    switch (this.value) {
      case MouseButtons.LEFT:
        return MouseButtons.RIGHT;
      case MouseButtons.RIGHT:
        return MouseButtons.LEFTRIGHT;
      case MouseButtons.LEFTRIGHT:
        return MouseButtons.LEFT;
    }
  }
}
