import { Component, Vue, Prop } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import TypePicker from '@/components/TypePicker/TypePicker.vue';
import Checkbox from '@/components/Checkbox/Checkbox.vue';
import { StratFilters } from '@/store/modules/filter';
import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';
import { filterModule, stratModule } from '@/store/namespaces';
import { toggleArray } from '@/utils/toggleArray';

@Component({
  components: {
    SidePicker,
    TypePicker,
    Checkbox,
  },
})
export default class StratFilterForm extends Vue {
  @Prop() filters!: StratFilters;
  @stratModule.Getter readonly allLabels!: string[];
  @filterModule.Action updateStratLabelsFilter!: (value: string[]) => Promise<void>;

  get nameFilter() {
    return this.filters.name;
  }

  set nameFilter(value: string) {
    this.$emit('name-filter-change', value);
  }

  get contentFilter() {
    return this.filters.content;
  }

  set contentFilter(value: string) {
    this.$emit('content-filter-change', value);
  }

  get typeFilters() {
    return this.filters.types;
  }

  set typeFilters(value: StratTypes[]) {
    this.$emit('type-filter-change', value);
  }

  get inactiveFilter() {
    return this.filters.inactive;
  }

  set inactiveFilter(value: boolean) {
    this.$emit('inactive-filter-change', value);
  }

  get sideFilter() {
    return this.filters.side;
  }

  labelClicked(label: string) {
    return this.updateStratLabelsFilter(toggleArray(this.filters.labels, label));
  }

  isLabelActive(label: string) {
    return this.filters.labels.includes(label);
  }

  set sideFilter(side: Sides | null) {
    if (this.filters.side === side) {
      this.$emit('side-filter-change', null);
    } else {
      this.$emit('side-filter-change', side);
    }
  }
}
