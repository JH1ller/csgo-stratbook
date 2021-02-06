import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import StratItem from '@/components/StratItem/StratItem.vue';
import { StratFilters } from '@/store/modules/filter';
import { Strat } from '@/api/models/Strat';
import { extractTextFromHTML } from '@/utils/extractTextFromHTML';
@Component({
  components: {
    StratItem,
  },
})
export default class StratList extends Vue {
  @Prop() completedTutorial!: boolean;
  @Prop() tutorialStrat!: Strat | null;
  @Prop() strats!: Strat[];
  @Prop() filters!: StratFilters;

  private get filteredStrats() {
    // TODO: cleanup and use only one filter() to improve performance
    // TODO: also, move to vuex getter
    return this.strats
      .filter(strat => {
        return this.filters.side ? strat.side === this.filters.side : true;
      })
      .filter(strat => {
        return this.filters.type ? strat.type === this.filters.type : true;
      })
      .filter(strat => {
        return this.filters.name ? strat.name.toLowerCase().includes(this.filters.name.toLowerCase()) : true;
      })
      .filter(strat => {
        return this.filters.content
          ? extractTextFromHTML(strat.content)
              .toLowerCase()
              .includes(this.filters.content.toLowerCase())
          : true;
      });
  }

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
