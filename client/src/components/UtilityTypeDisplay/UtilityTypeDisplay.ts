import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class UtilityTypeDisplay extends Vue {
  private Types: typeof UtilityTypes = UtilityTypes;
  @Prop() type!: UtilityTypes;
}
