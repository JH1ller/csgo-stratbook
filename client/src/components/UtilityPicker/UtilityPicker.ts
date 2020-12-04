import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class UtilityPicker extends Vue {
  private Types: typeof UtilityTypes = UtilityTypes;
  @Prop() value!: UtilityTypes;

  @Emit()
  private input(type: UtilityTypes) {
    return type;
  }
}
