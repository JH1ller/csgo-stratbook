import { UtilityMovement } from '@/api/models/UtilityMovement';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class PosePicker extends Vue {
  @Prop() private crouch!: boolean;
  @Prop() private jump!: boolean;
  @Prop() private movement!: UtilityMovement;
  @Prop({ default: false }) readonly!: boolean;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;

  @Emit()
  private toggleCrouch() {
    return;
  }

  @Emit()
  private toggleJump() {
    return;
  }

  @Emit()
  private toggleMovement() {
    return;
  }
}
