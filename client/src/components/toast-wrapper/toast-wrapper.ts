import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Toast } from './toast-wrapper.models';

const appModule = namespace('app');

@Component({})
export default class ToastWrapper extends Vue {
  @appModule.State(state => state.ui.toasts) private toasts!: Toast[];
}
