import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

@Component({})
export default class FloatingAdd extends Vue {
  @Emit()
  private onClick() {
    return;
  }
}
