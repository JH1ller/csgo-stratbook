import { Component, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class FilterButton extends Vue {
  @Emit()
  private click() {
    return;
  }
}
