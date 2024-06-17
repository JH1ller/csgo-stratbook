import { Notice } from '@/api/models/Notice';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component({})
export default class NoticeDialog extends Vue {
  @Prop() notices!: Notice[];

  @Emit()
  close() {
    return;
  }
}
