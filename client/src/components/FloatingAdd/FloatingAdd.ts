import { Component, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class FloatingAdd extends Vue {
  @Emit()
  private onClick() {
    return;
  }
}
