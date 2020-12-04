import { UtilityMovement } from '@/api/models/UtilityMovement';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class PosePicker extends Vue {
  @Prop() private crouch!: boolean;
  @Prop() private movement!: UtilityMovement;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;

  @Emit()
  private toggleCrouch() {
    return;
  }

  @Emit()
  private toggleMovement() {
    return;
  }
}
