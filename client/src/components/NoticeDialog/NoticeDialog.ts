import { Notice } from '@/api/models/Notice';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import BackdropDialog from '../BackdropDialog/BackdropDialog.vue';

@Component({
  components: {
    BackdropDialog,
  },
})
export default class NoticeDialog extends Vue {
  @Prop() notices!: Notice[];

  @Emit()
  close() {
    return;
  }
}
