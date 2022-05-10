import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BackdropDialog extends Vue {
  @Prop({ default: false }) fullscreen!: boolean;

  @Emit()
  close(): void {
    return;
  }
}
