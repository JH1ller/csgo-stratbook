import { Component, Vue } from 'vue-property-decorator';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog.vue';
import { Dialog } from './DialogWrapper.models';
import { appModule } from '@/store/namespaces';

@Component({
  components: { ConfirmDialog },
})
export default class DialogWrapper extends Vue {
  @appModule.State openDialogs!: Dialog[];
  @appModule.Action closeDialog!: (key: string) => Promise<void>;
}
