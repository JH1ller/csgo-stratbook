import { Sides } from '@/api/models/Sides';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class SideBadge extends Vue {
  private Sides: typeof Sides = Sides;
  @Prop() private side!: Sides;
}
