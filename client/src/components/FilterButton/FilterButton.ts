import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

@Component({})
export default class FilterButton extends Vue {
  @Prop() private activeFilterCount!: number;
  @Emit()
  private click() {
    return;
  }
}
