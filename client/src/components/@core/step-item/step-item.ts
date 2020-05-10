import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { Map, Strat, Step, Player, Sides, NadeTypes } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class StepItem extends Vue {
  @Prop() private step!: Step;
  private editMode: boolean = false;
  private description: string = '';

  @Emit()
  private deleteClicked() {
    return this.step._id;
  }

  get flashbangActive() {
    return this.step.grenades?.includes(NadeTypes.FLASHBANG);
  }
  get flashbangTwoActive() {
    return (
      this.step.grenades?.includes(NadeTypes.FLASHBANG) &&
      this.countOccurences(this.step.grenades, NadeTypes.FLASHBANG) > 1
    );
  }
  get smokeActive() {
    return this.step.grenades?.includes(NadeTypes.SMOKE);
  }
  get molotovActive() {
    return this.step.grenades?.includes(NadeTypes.MOLOTOV);
  }
  get grenadeActive() {
    return this.step.grenades?.includes(NadeTypes.GRENADE);
  }

  private countOccurences(arr: string[], item: string) {
    return arr.reduce(
      (acc: number, curr: string): number => (curr === item ? (acc += 1) : acc),
      0
    );
  }

  private mounted() {
    this.description = this.step.description ?? '';
  }

  private enableEditMode(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = true;
  }

  private cancelEdit() {
    this.editMode = false;
    this.description = this.step.description ?? '';
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.editMode) {
      switch (e.key) {
        case 'Enter':
          this.$emit('update-step', this.step);
          this.editMode = false;
          break;
        case 'Escape':
          this.cancelEdit();
      }
    }
  }
}
