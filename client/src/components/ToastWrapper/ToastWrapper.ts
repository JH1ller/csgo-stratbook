import { Component, Vue } from 'vue-property-decorator';
import { Toast } from './ToastWrapper.models';
import { appModule } from '@/store/namespaces';

@Component({})
export default class ToastWrapper extends Vue {
  @appModule.State private toasts!: Toast[];
}
