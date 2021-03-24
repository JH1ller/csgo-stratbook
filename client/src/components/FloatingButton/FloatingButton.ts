import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

@Component({})
export default class FloatingButton extends Vue {
  @Prop() private label!: string;
  @Prop() private icon!: string;

  @Emit()
  private click() {
    return;
  }
}
