import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class Checkbox extends Vue {
  @Prop() value!: boolean;
  @Prop() label!: string;
  @Prop() name!: string;

  @Emit()
  private input(value: boolean) {
    return value;
  }
}
