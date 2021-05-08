import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import StratItem from '@/components/StratItem/StratItem.vue';
import { Strat } from '@/api/models/Strat';
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

  private isCollapsed(strat: Strat) {
    return this.collapsedStrats.some(id => id === strat._id);
  }

  private isEdited(strat: Strat) {
    return this.editedStrats.some(id => id === strat._id);
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
}
