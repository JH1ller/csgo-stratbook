import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { Strat, Sides, StratTypes, Step } from '@/services/models';
import StratItem from '@/components/strat-item/strat-item.vue';
import { stratModule, filterModule } from '@/store/namespaces';

@Component({
  components: {
    StratItem,
  },
})
export default class StratList extends Vue {
  @stratModule.State strats!: Strat[];
  @filterModule.State filters!: {
    name: string;
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };

  private get filteredStrats() {
    return this.strats
      .filter(strat => {
        return this.filters.side ? strat.side === this.filters.side : true;
      })
      .filter(strat => {
        return this.filters.type ? strat.type === this.filters.type : true;
      })
      .filter(strat => {
        return this.filters.name ? strat.name.toLowerCase().includes(this.filters.name.toLowerCase()) : true;
      });
  }

  // Emitted through from strat-item
  @Emit()
  private deleteStrat(stratID: string) {
    return stratID;
  }

  // Emitted through from strat-item
  @Emit()
  private toggleActive(payload: Partial<Strat>) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private updateStep(payload: Partial<Step>) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private addStep(payload: any) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private editStrat(strat: Strat) {
    return strat;
  }

  // Emitted through from strat-item
  @Emit()
  private deleteStep(stepID: string) {
    return stepID;
  }
}
