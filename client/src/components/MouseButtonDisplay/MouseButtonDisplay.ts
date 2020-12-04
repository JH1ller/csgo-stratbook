import { MouseButtons } from '@/api/models/MouseButtons';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class MouseButtonPicker extends Vue {
  @Prop({ default: MouseButtons.LEFT }) private mouseButtons!: MouseButtons;
  @Prop({ default: false }) readonly!: boolean;

  private MouseButtons: typeof MouseButtons = MouseButtons;
}
