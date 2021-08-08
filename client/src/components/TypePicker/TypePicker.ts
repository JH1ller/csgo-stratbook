import { StratTypes } from '@/api/models/StratTypes';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class TypePicker extends Vue {
  private Types: typeof StratTypes = StratTypes;
  @Prop() value!: StratTypes;

  @Emit()
  private input(type: StratTypes) {
    return type;
  }
}
