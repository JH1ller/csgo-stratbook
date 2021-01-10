import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

@Component({})
export default class FloatingAdd extends Vue {
  @Prop({ default: 'Add' }) private label!: string;
  @Emit()
  private click() {
    return;
  }
}
