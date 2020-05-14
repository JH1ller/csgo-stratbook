import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
const { remote } = require('electron');
import { Map, Strat, Step, Player } from '@/services/models';
import StratItem from '@/components/strat-item/strat-item.vue';

@Component({
  components: {
    StratItem,
  },
  computed: mapState(['currentStrats']),
})
export default class StratList extends Vue {
  private currentStrats!: Strat[];

  // Emitted through from strat-item
  @Emit()
  private deleteClicked(stratId: string) {
    return stratId;
  }

  // Emitted through from strat-item
  @Emit()
  private toggleActive(payload: any) {
    return payload;
  }

  // Emitted through from strat-item
  @Emit()
  private updateStep(changeObj: any) {
    return changeObj;
  }

  // Emitted through from strat-item
  @Emit()
  private editStrat(strat: Strat) {
    return strat;
  }
}
