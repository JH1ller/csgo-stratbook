import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import StratItem from '@/components/StratItem/StratItem.vue';
import { Strat } from '@/api/models/Strat';
import { StratTypes } from '@/api/models/StratTypes';
import { Sides } from '@/api/models/Sides';
import { Listen } from '@/utils/decorators/listen.decorator';
import { debounce, DebouncedFunc } from 'lodash-es';

@Component({
  components: {
    StratItem,
  },
})
export default class StratList extends Vue {
  @Prop() completedTutorial!: boolean;
  @Prop() tutorialStrat!: Strat | null;
  @Prop() strats!: Strat[];
  @Prop() collapsedStrats!: string[];
  @Prop() editedStrats!: string[];
  @Prop() gameMode!: boolean;

  // used to force rerender of StratItem components after window resize
  // to adjust their height
  remountKey = 0;
  prevWidth = window.innerWidth;

  private isCollapsed(strat: Strat) {
    return this.collapsedStrats.some((id) => id === strat._id);
  }

  @Listen('resize', { window: true })
  onResize() {
    if (this.prevWidth !== window.innerWidth) {
      this.prevWidth = window.innerWidth;
      this.debouncedResizeHandler();
    }
  }

  get debouncedResizeHandler(): DebouncedFunc<() => void> {
    return debounce(() => this.remountKey++, 100);
  }

  private isEdited(strat: Strat) {
    return this.editedStrats.some((id) => id === strat._id);
  }

  // TODO: solve this drilling with provide/inject
  // Emitted through from strat-item
  @Emit()
  private deleteStrat(stratID: string) {
    return stratID;
  }

  @Emit()
  private shareStrat(stratID: string) {
    return stratID;
  }

  @Emit()
  private unshareStrat(stratID: string) {
    return stratID;
  }

  @Emit()
  private toggleActive(payload: Partial<Strat>) {
    return payload;
  }

  @Emit()
  private editStrat(strat: Strat) {
    return strat;
  }

  @Emit()
  private updateContent(payload: Partial<Strat>) {
    return payload;
  }

  @Emit()
  private showMap(strat: Strat) {
    return strat;
  }

  @Emit()
  private toggleCollapse(stratID: string) {
    return stratID;
  }

  @Emit()
  private editChanged(payload: { stratID: string; value: boolean }) {
    return payload;
  }

  @Emit()
  private editorFocussed() {
    return;
  }

  @Emit()
  private editorBlurred() {
    return;
  }

  @Emit()
  private filterType(value: StratTypes) {
    return value;
  }

  @Emit()
  private filterSide(value: Sides) {
    return value;
  }
}
