import { StratTypes } from '@/api/models/StratTypes';
import { toggleArray } from '@/utils/toggleArray';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class TypePicker extends Vue {
  private Types: typeof StratTypes = StratTypes;
  @Prop() value!: StratTypes[];
  @Prop({ default: false }) allowNone!: boolean;

  @Emit()
  private input(type: StratTypes) {
    const types = toggleArray(this.value, type);
    return this.allowNone || types.length ? types : this.value;
  }
}
