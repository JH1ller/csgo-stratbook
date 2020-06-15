import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
@Component({})
export default class Toast extends Vue {
  @State(state => state.ui.toast.message) message!: string;
  @State(state => state.ui.toast.show) show!: boolean;

  @Watch('show')
  showChangedHandler(to: boolean, from: boolean) {
    if (to === true) {
      setTimeout(() => {
        this.$store.dispatch('hideToast');
      }, 3000);
    }
  }
}
