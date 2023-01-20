import { Component, Vue, Prop } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import TypePicker from '@/components/TypePicker/TypePicker.vue';
import Checkbox from '@/components/Checkbox/Checkbox.vue';
import { StratFilters } from '@/store/modules/filter';
import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';

@Component({
  components: {
    SidePicker,
    TypePicker,
    Checkbox,
  },
})
export default class StratFilterForm extends Vue {
  @Prop() filters!: StratFilters;

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

  private get typeFilters() {
    return this.filters.types;
  }

  private set typeFilters(value: StratTypes[]) {
    this.$emit('type-filter-change', value);
  }

  private get inactiveFilter() {
    return this.filters.inactive;
  }

  private set inactiveFilter(value: boolean) {
    this.$emit('inactive-filter-change', value);
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
}
