import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { Map, Strat, Step, Player, Sides, Equipment } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

export interface IStepItem {
  cancelEdit: () => void;
}

@Component({
  components: {},
})
export default class StepItem extends Vue implements IStepItem {
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

  private mounted() {
    this.resetValues();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private resetValues() {
    if (this.step && !this.addMode) {
      this.descriptionCopy = this.step.description ?? '';
      this.equipmentCopy = this.step.equipment;
    } else {
      this.descriptionCopy = '';
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
      this.equipmentCopy[type as keyof Equipment] = !this.equipmentCopy[
        type as keyof Equipment
      ];
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

  private handleKeyDown(e: KeyboardEvent) {
    if (this.editMode) {
      switch (e.key) {
        case 'Enter':
          if (this.addMode) {
            this.$emit('add-step', {
              description: this.descriptionCopy,
              equipment: this.equipmentCopy,
            });
            this.resetValues();
          } else {
            this.$emit('update-step', {
              stepId: this.step?._id,
              description: this.descriptionCopy,
              equipment: this.equipmentCopy,
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
