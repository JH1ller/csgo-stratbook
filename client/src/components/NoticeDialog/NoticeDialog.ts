import { Notice } from '@/api/models/Notice';
import { Component, Prop, Vue, Emit, Inject } from 'vue-property-decorator';
import BackdropDialog from '../BackdropDialog/BackdropDialog.vue';
import StorageService from '@/services/storage.service';

@Component({
  components: {
    BackdropDialog,
  },
})
export default class NoticeDialog extends Vue {
  @Prop() notices!: Notice[];
  @Inject() readonly storageService!: StorageService;

  currentNoticeIndex = 0;

  get sortedNotices() {
    return this.notices.sort((a, b) => new Date(a.expires).getTime() - new Date(b.expires).getTime());
  }

  get currentNotice() {
    return this.sortedNotices[this.currentNoticeIndex];
  }

  storeSeenNotice() {
    const currentSeenNotices = this.storageService.get('seenNotices');
    if (currentSeenNotices && currentSeenNotices.includes(this.currentNotice.id)) return;
    this.storageService.set('seenNotices', [...(this.storageService.get('seenNotices') || []), this.currentNotice.id]);
  }

  mounted() {
    this.storeSeenNotice();
  }

  next() {
    this.currentNoticeIndex = (this.currentNoticeIndex + 1) % this.notices.length;
    this.storeSeenNotice();
  }

  prev() {
    this.currentNoticeIndex = (this.currentNoticeIndex - 1 + this.notices.length) % this.notices.length;
    this.storeSeenNotice();
  }

  @Emit()
  close() {
    return;
  }
}
