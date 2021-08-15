/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

export interface FABOption {
  label: string;
  icon: string;
  action: () => any;
}

@Component({})
export default class FloatingButton extends Vue {
  @Prop({ required: false }) private label!: string;
  @Prop() private icon!: string;

  //* WIP
  @Prop() private subOptions!: FABOption[];

  private open = false;

  @Emit()
  private click() {
    //
  }
}
