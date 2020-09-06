import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import ConfirmDialog from '@/components/confirm-dialog/confirm-dialog.vue';
import { Dialog } from './dialog-wrapper.models';

const appModule = namespace('app');

@Component({
  components: { ConfirmDialog },
})
export default class DialogWrapper extends Vue {
  @appModule.State private openDialogs!: Dialog[];
  @appModule.Action private closeDialog!: (key: string) => Promise<void>;
}
