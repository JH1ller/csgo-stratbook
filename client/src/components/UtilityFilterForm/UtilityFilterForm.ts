import { Component, Vue, Prop } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import UtilityPicker from '@/components/UtilityPicker/UtilityPicker.vue';
import { UtilityFilters } from '@/store/modules/filter';
import { Sides } from '@/api/models/Sides';
import { UtilityTypes } from '@/api/models/UtilityTypes';

@Component({
  components: {
    SidePicker,
    UtilityPicker,
  },
})
export default class UtilityFilterForm extends Vue {
  @Prop() filters!: UtilityFilters;

  private get nameFilter() {
    return this.filters.name;
  }

  private set nameFilter(value: string) {
    this.$emit('name-filter-change', value);
  }

  private get typeFilter() {
    return this.filters.type;
  }

  private set typeFilter(type: UtilityTypes | null) {
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
}
