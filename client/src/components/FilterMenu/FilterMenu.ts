import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Player, Sides } from '@/api/models';
import Multiselect from 'vue-multiselect';
import { Filters } from '@/store/modules/filter';

@Component({
  components: {
    Multiselect,
  },
})
export default class FilterMenu extends Vue {
  @Prop() filters!: Filters
  @Prop() teamMembers!: Player[];

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
