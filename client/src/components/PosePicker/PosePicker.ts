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

  private crouchTitle(): string {
    return this.crouch ? "Crouching": "Standing";
  }

  private jumpTitle(): string {
    return this.jump ? "Jump": "Don´t jump";
  }

  private movementTitle(): string {
    switch (this.movement) {
      case UtilityMovement.STILL:
        return "Still";
      case UtilityMovement.WALK:
        return "Walking";
      case UtilityMovement.DOUBLEU:
        return "Simul-press W";
      case UtilityMovement.RUN:
        return "Running";
    }

    return "";
  }
}
