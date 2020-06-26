import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Map, Strat, Step, Player, Sides, StratTypes } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Multiselect from 'vue-multiselect';

config.autoAddCss = false;
library.add(faFilter);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    Multiselect,
  },
})
export default class FilterMenu extends Vue {
  @State filters!: {
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };
  @State teamMembers!: Player[];

  @Emit()
  private updateFilter() {
    return;
  }

  private get playerOptions() {
    const teamMemberNames = this.teamMembers.map(member => member.name);
    return ['', ...teamMemberNames];
  }
}
