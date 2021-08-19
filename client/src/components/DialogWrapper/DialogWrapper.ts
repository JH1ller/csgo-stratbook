import { Component, Vue } from 'vue-property-decorator';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { Dialog } from './DialogWrapper.models';
import { appModule } from '@/store/namespaces';

@Component({
  components: { ConfirmDialog },
})
export default class DialogWrapper extends Vue {
  @appModule.State private openDialogs!: Dialog[];
  @appModule.Action private closeDialog!: (key: string) => Promise<void>;
}
