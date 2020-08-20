import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Strat, Sides, StratTypes } from '@/services/models';
import StratItem from '@/components/strat-item/strat-item.vue';

const stratModule = namespace('strat');
const filterModule = namespace('filter');

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
  private deleteClicked(stratId: string) {
    return stratId;
  }

  // Emitted through from strat-item
  @Emit()
  private toggleActive(payload: Partial<Strat>) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private updateStep(changeObj: any) {
    return changeObj;
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
  private deleteStep(stepId: string) {
    return stepId;
  }
}
