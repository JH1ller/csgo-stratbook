import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import StratItem from '@/components/StratItem/StratItem.vue';
import type IStratItem from '@/components/StratItem/StratItem';
import type { Strat } from '@/api/models/Strat';
import type { StratTypes } from '@/api/models/StratTypes';
import { Sides } from '@/api/models/Sides';
import { SlickList, SlickItem } from 'vue-slicksort';
import { stratModule } from '@/store/namespaces';

@Component({
  components: {
    StratItem,
    SlickList,
    SlickItem,
  },
})
export default class StratList extends Vue {
  @stratModule.Action updateStrats!: (payload: Partial<Strat>[]) => Promise<void>;
  @stratModule.Action updateMultipleStratLocally!: (payload: { strats: Strat[] }) => Promise<void>;
  @Prop() completedTutorial!: boolean;
  @Prop() tutorialStrat!: Strat | null;
  @Prop() strats!: Strat[];
  @Prop() collapsedStrats!: string[];
  @Prop() editedStrats!: string[];
  @Prop() readOnly!: boolean;
  @Ref() stratItemComponents!: IStratItem[];

  isCollapsed(strat: Strat) {
    return this.collapsedStrats.some((id) => id === strat._id);
  }

  async handleSortChange(strats: Strat[]) {
    const mappedStrats = strats.map((strat, i) => ({ ...strat, index: i }));
    const stratsToUpdate = mappedStrats.filter(
      (strat) => this.strats.find((s) => s._id === strat._id)!.index !== strat.index,
    );
    if (!stratsToUpdate.length) return;
    this.updateMultipleStratLocally({ strats: stratsToUpdate });
    await this.updateStrats(stratsToUpdate);
  }

  isEdited(strat: Strat) {
    return this.editedStrats.some((id) => id === strat._id);
  }

  // TODO: solve this drilling with provide/inject
  // Emitted through from strat-item
  @Emit()
  deleteStrat(stratID: string) {
    return stratID;
  }

  @Emit()
  shareStrat(stratID: string) {
    return stratID;
  }

  @Emit()
  unshareStrat(stratID: string) {
    return stratID;
  }

  @Emit()
  editStrat(strat: Strat) {
    return strat;
  }

  @Emit()
  updateStrat(payload: Partial<Strat>) {
    return payload;
  }

  @Emit()
  showMap(strat: Strat) {
    return strat;
  }

  @Emit()
  toggleCollapse(stratID: string) {
    return stratID;
  }

  @Emit()
  editChanged(payload: { stratID: string; value: boolean }) {
    return payload;
  }

  @Emit()
  editorFocussed() {
    return;
  }

  @Emit()
  editorBlurred() {
    return;
  }

  @Emit()
  filterType(value: StratTypes) {
    return value;
  }

  @Emit()
  filterSide(value: Sides) {
    return value;
  }
}
