import { StratTypes } from '@/api/models/StratTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class TypeBadge extends Vue {
  private Types: typeof StratTypes = StratTypes;
  @Prop() private type!: StratTypes;
}
