import CloseOnEscape from '@/mixins/CloseOnEscape';
import { Component, Emit, Prop, Mixins } from 'vue-property-decorator';

@Component({})
export default class FilterMenu extends Mixins(CloseOnEscape) {
  @Prop() open!: boolean;

  @Emit()
  private clearFilters() {
    //
  }
}
