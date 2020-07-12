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
    name: string;
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };
  @State teamMembers!: Player[];

  private get playerOptions() {
    const teamMemberNames = this.teamMembers.map(member => member.name);
    return ['', ...teamMemberNames];
  }

  private get nameFilterValue() {
    return this.filters.name;
  }

  private set nameFilterValue(value: string) {
    this.$emit('name-filter-selected', value);
  }

  @Emit()
  private playerSelected(option: string) {
    return option;
  }

  private selectTypeFilter(type: string) {
    if (this.filters.type === type) {
      this.$emit('type-filter-selected', null);
    } else {
      this.$emit('type-filter-selected', type);
    }
  }

  private selectSideFilter(side: Sides) {
    if (this.filters.side === side) {
      this.$emit('side-filter-selected', null);
    } else {
      this.$emit('side-filter-selected', side);
    }
  }

  @Emit()
  private clearFilters() {
    return;
  }
}