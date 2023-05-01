import { Component, Prop, Vue, Emit, Ref, Watch } from 'vue-property-decorator';
import StratItem from '@/components/StratItem/StratItem.vue';
import type IStratItem from '@/components/StratItem/StratItem';
import { Strat } from '@/api/models/Strat';
import { StratTypes } from '@/api/models/StratTypes';
import { Sides } from '@/api/models/Sides';
import { Listen } from '@/utils/decorators/listen.decorator';
import { debounce, DebouncedFunc } from 'lodash-es';
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
  @stratModule.Action updateStratsLocally!: (strats: Strat[]) => Promise<void>;
  @stratModule.Action updateStrats!: (payload: Partial<Strat>[]) => Promise<void>;
  @stratModule.Action fetchStrats!: () => Promise<void>;
  @Prop() completedTutorial!: boolean;
  @Prop() tutorialStrat!: Strat | null;
  @Prop() strats!: Strat[];
  @Prop() collapsedStrats!: string[];
  @Prop() editedStrats!: string[];
  @Prop() gameMode!: boolean;
  @Ref() stratItemComponents!: IStratItem[];

  prevWidth = window.innerWidth;

  private isCollapsed(strat: Strat) {
    return this.collapsedStrats.some((id) => id === strat._id);
  }

  async handleSortChange(strats: Strat[]) {
    console.log(strats.map((s) => s.name + ' i = ' + s.index));
    // await Promise.all(
    //   strats.map(async (strat, i) => {
    //     if (this.strats[i]._id !== strat._id) {
    //       console.log('update strat ', strat.name, 'index old: ', strat.index, 'index new: ', i);
    //       await this.updateStrats({ _id: strat._id, index: i });
    //     }
    //   }),
    // );
    const mappedStrats = strats.map((strat, i) => ({ _id: strat._id, index: i }));
    console.log('mappedStrats', mappedStrats);
    const stratsToUpdate = mappedStrats.filter(
      (strat) => this.strats.find((s) => s._id === strat._id)!.index !== strat.index,
    );
    console.log('stratsToUpdate', stratsToUpdate);
    await this.updateStrats(stratsToUpdate);
    //this.fetchStrats();
    //await this.updateStratsLocally(strats.map((strat, index) => ({ ...strat, index })));
  }

  @Listen('resize', { window: true })
  onResize() {
    if (this.prevWidth !== window.innerWidth) {
      this.prevWidth = window.innerWidth;
      this.debouncedResizeHandler();
    }
  }

  @Watch('strats')
  stratsChanged(from: Strat[], to: Strat[]) {
    console.log('stratsChanged');
    console.log(from, to);
  }

  get debouncedResizeHandler(): DebouncedFunc<() => void> {
    return debounce(() => this.stratItemComponents?.forEach((i) => i.resetHeight()), 50);
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
