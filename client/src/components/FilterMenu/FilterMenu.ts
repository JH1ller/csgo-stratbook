import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

@Component({})
export default class FilterMenu extends Vue {
  @Prop() open!: boolean;

  @Emit()
  private clearFilters() {
    return;
  }

  @Emit()
  private close() {
    return;
  }
}
