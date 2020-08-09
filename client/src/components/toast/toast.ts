import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const appModule = namespace('app');

@Component({})
export default class Toast extends Vue {
  @appModule.State(state => state.ui.toast.message) private message!: string;
  @appModule.State(state => state.ui.toast.show) private show!: boolean;
  @appModule.Action private hideToast!: () => void;

  @Watch('show')
  showChangedHandler(to: boolean) {
    if (to) {
      setTimeout(() => {
        this.hideToast();
      }, 3000);
    }
  }
}
