import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Step, Player, Equipment } from '@/services/models';
import { namespace } from 'vuex-class';
import Multiselect from 'vue-multiselect';

const teamModule = namespace('team');

export interface IStepItem {
  cancelEdit: () => void;
}

@Component({
  components: {
    Multiselect,
  },
})
export default class StepItem extends Vue implements IStepItem {
  @teamModule.State teamMembers!: Player[];
  @Prop({ default: null }) private step!: Step | null;
  private editMode: boolean = false;
  @Prop({ default: false }) addMode!: boolean;
  private descriptionCopy: string = '';
  private equipmentCopy: Equipment = {
    grenade: false,
    smoke: false,
    flashbang: false,
    flashbangTwo: false,
    molotov: false,
    defuseKit: false,
  };
  private actorCopy = '';

  private mounted() {
    this.resetValues();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  get selectOptions() {
    const teamMemberNames = this.teamMembers.map(member => member.name);
    return [...teamMemberNames, '1st Spawn', '2nd Spawn', '3rd Spawn', '4th Spawn', '5th Spawn'];
  }

  private resetValues() {
    if (this.step && !this.addMode) {
      this.descriptionCopy = this.step.description ?? '';
      this.equipmentCopy = { ...this.step.equipment };
      this.actorCopy = this.step.actor ?? '';
    } else {
      this.descriptionCopy = '';
      this.actorCopy = '';
      this.equipmentCopy = {
        grenade: false,
        smoke: false,
        flashbang: false,
        flashbangTwo: false,
        molotov: false,
        defuseKit: false,
      };
    }
  }

  private beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  @Emit()
  private deleteClicked() {
    if (this.step) return this.step._id;
  }

  public cancelEdit() {
    this.editMode = false;
    this.resetValues();
  }

  // TODO: refactor this mess
  private toggleEquip(type: string) {
    if (!this.editMode && !this.addMode) return;
    if (type === 'flashbangTwo' && this.equipmentCopy) {
      if (this.equipmentCopy.flashbangTwo === false) {
        if (this.equipmentCopy.flashbang === false) {
          this.equipmentCopy.flashbang = true;
        }
        this.equipmentCopy.flashbangTwo = true;
      } else {
        this.equipmentCopy.flashbangTwo = false;
      }
    } else if (
      type === 'flashbang' &&
      this.equipmentCopy.flashbangTwo === true &&
      this.equipmentCopy.flashbang === true
    ) {
      this.equipmentCopy.flashbangTwo = false;
      this.equipmentCopy.flashbang = false;
    } else {
      this.equipmentCopy[type as keyof Equipment] = !this.equipmentCopy[type as keyof Equipment];
    }
  }

  private handleClick(e: MouseEvent) {
    if (this.addMode && !this.editMode) {
      this.enableEditMode(e);
    }
  }

  private enableEditMode(e: MouseEvent) {
    e.stopPropagation();
    this.$emit('edit-enabled');
    this.editMode = true;
  }

  @Emit()
  private deleteStep() {
    this.$emit('edit-enabled');
    return this.step?._id;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.editMode) {
      switch (e.key) {
        case 'Enter':
          if (this.addMode) {
            this.$emit('add-step', {
              description: this.descriptionCopy,
              equipment: this.equipmentCopy,
              actor: this.actorCopy,
            });
            this.resetValues();
          } else {
            this.$emit('update-step', {
              _id: this.step?._id,
              description: this.descriptionCopy,
              equipment: this.equipmentCopy,
              actor: this.actorCopy,
            });
          }
          this.editMode = false;
          break;
        case 'Escape':
          this.cancelEdit();
      }
    }
  }
}
