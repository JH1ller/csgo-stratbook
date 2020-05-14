import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { Map, Strat, Step, Player, Sides, NadeTypes } from '@/services/models';
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
  @Prop() private step!: Step;
  private editMode: boolean = false;
  private descriptionCopy: string = this.step.description ?? '';
  private activeGrenadesCopy: any = { ...this.activeGrenades };

  private mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  @Emit()
  private deleteClicked() {
    return this.step._id;
  }

  get activeGrenades() {
    console.log('hi');
    return {
      grenade: this.step.grenades?.includes(NadeTypes.GRENADE),
      smoke: this.step.grenades?.includes(NadeTypes.SMOKE),
      flashbang: this.step.grenades?.includes(NadeTypes.FLASHBANG),
      flashbangTwo:
        this.step.grenades?.includes(NadeTypes.FLASHBANG) &&
        this.countOccurences(this.step.grenades, NadeTypes.FLASHBANG) > 1,
      molotov: this.step.grenades?.includes(NadeTypes.MOLOTOV),
    };
  }

  public cancelEdit() {
    this.editMode = false;
    this.descriptionCopy = this.step.description ?? '';
    this.activeGrenadesCopy = { ...this.activeGrenades };
  }

  private countOccurences(arr: string[], item: string) {
    return arr.reduce(
      (acc: number, curr: string): number => (curr === item ? (acc += 1) : acc),
      0
    );
  }

  private toggleGrenade(grenade: NadeTypes | string) {
    if (!this.editMode) return;
    if (grenade === 'FLASHBANG_TWO') {
      if (this.activeGrenadesCopy.flashbangTwo === false) {
        if (this.activeGrenadesCopy.flashbang === false) {
          this.activeGrenadesCopy.flashbang = true;
        }
        this.activeGrenadesCopy.flashbangTwo = true;
      } else {
        this.activeGrenadesCopy.flashbangTwo = false;
      }
    } else if (
      grenade === NadeTypes.FLASHBANG &&
      this.activeGrenadesCopy.flashbangTwo === true &&
      this.activeGrenadesCopy.flashbang === true
    ) {
      this.activeGrenadesCopy.flashbangTwo = false;
      this.activeGrenadesCopy.flashbang = false;
    } else {
      this.activeGrenadesCopy[grenade.toLowerCase()] = !this.activeGrenadesCopy[
        grenade.toLowerCase()
      ];
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
          this.$emit('update-step', {
            stepId: this.step._id,
            description: this.descriptionCopy,
          });
          this.editMode = false;
          break;
        case 'Escape':
          this.cancelEdit();
      }
    }
  }
}
