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

  // TODO: solve this drilling with provide/inject
  // Emitted through from strat-item
  @Emit()
  private deleteStrat(stratID: string) {
    return stratID;
  }

  // Emitted through from strat-item
  @Emit()
  private shareStrat(stratID: string) {
    return stratID;
  }

  // Emitted through from strat-item
  @Emit()
  private unshareStrat(stratID: string) {
    return stratID;
  }

  // Emitted through from strat-item
  @Emit()
  private toggleActive(payload: Partial<Strat>) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private editStrat(strat: Strat) {
    return strat;
  }

  // Emitted through from strat-item
  @Emit()
  private updateContent(payload: Partial<Strat>) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private showMap(strat: Strat) {
    return strat;
  }
}
