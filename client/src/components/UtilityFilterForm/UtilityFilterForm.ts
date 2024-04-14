import { Component, Vue, Prop } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import UtilityPicker from '@/components/UtilityPicker/UtilityPicker.vue';
import { UtilityFilters } from '@/store/modules/filter';
import { Sides } from '@/api/models/Sides';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { filterModule, utilityModule } from '@/store/namespaces';
import { toggleArray } from '@/utils/toggleArray';

@Component({
  components: {
    SidePicker,
    UtilityPicker,
  },
})
export default class UtilityFilterForm extends Vue {
  @Prop() filters!: UtilityFilters;
  @utilityModule.Getter readonly allLabels!: string[];
  @filterModule.Action updateUtilityLabelsFilter!: (value: string[]) => Promise<void>;

  get nameFilter() {
    return this.filters.name;
  }

  set nameFilter(value: string) {
    this.$emit('name-filter-change', value);
  }

  get typeFilter() {
    return this.filters.type;
  }

  set typeFilter(type: UtilityTypes | null) {
    if (this.filters.type === type) {
      this.$emit('type-filter-change', null);
    } else {
      this.$emit('type-filter-change', type);
    }
  }

  labelClicked(label: string) {
    return this.updateUtilityLabelsFilter(toggleArray(this.filters.labels, label));
  }

  isLabelActive(label: string) {
    return this.filters.labels.includes(label);
  }

  get sideFilter() {
    return this.filters.side;
  }

  set sideFilter(side: Sides | null) {
    if (this.filters.side === side) {
      this.$emit('side-filter-change', null);
    } else {
      this.$emit('side-filter-change', side);
    }
  }
}
