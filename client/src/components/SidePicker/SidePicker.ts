import { Sides } from '@/api/models/Sides';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class SidePicker extends Vue {
  private Sides: typeof Sides = Sides;
  @Prop() value!: Sides;

  @Emit()
  private input(side: Sides) {
    return side;
  }
}
