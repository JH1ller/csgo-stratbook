import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import TypePicker from '@/components/TypePicker/TypePicker.vue';
import { FilterState } from '@/store/modules/filter';
import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';

@Component({
  components: {
    SidePicker,
    TypePicker,
  },
})
export default class FilterMenu extends Vue {
  @Prop() filters!: FilterState;
  @Prop() open!: boolean;

  private get nameFilter() {
    return this.filters.name;
  }

  private set nameFilter(value: string) {
    this.$emit('name-filter-change', value);
  }

  private get contentFilter() {
    return this.filters.content;
  }

  private set contentFilter(value: string) {
    this.$emit('content-filter-change', value);
  }

  private get typeFilter() {
    return this.filters.type;
  }

  private set typeFilter(type: StratTypes | null) {
    if (this.filters.type === type) {
      this.$emit('type-filter-change', null);
    } else {
      this.$emit('type-filter-change', type);
    }
  }

  private get sideFilter() {
    return this.filters.side;
  }

  private set sideFilter(side: Sides | null) {
    if (this.filters.side === side) {
      this.$emit('side-filter-change', null);
    } else {
      this.$emit('side-filter-change', side);
    }
  }

  @Emit()
  private clearFilters() {
    return;
  }

  @Emit()
  private close() {
    return;
  }
}
