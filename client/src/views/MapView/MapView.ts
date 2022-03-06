import { Component, Inject, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import ConnectionDialog from './components/ConnectionDialog.vue';
import StorageService from '@/services/storage.service';

@Component({
  components: {
    SketchTool,
    ConnectionDialog,
  },
})
export default class MapView extends Vue {
  @Inject() storageService!: StorageService;
  userName = '';
  stratName = '';
  showConnectionDialog = false;

  handleSubmit({ userName, stratName }: { userName: string; stratName: string }) {
    this.userName = userName;
    this.stratName = stratName;
    this.storageService.set('draw-username', userName);
    this.showConnectionDialog = false;
  }

  created() {
    const userName = this.storageService.get('draw-username');
    if (userName) {
      this.userName = userName;
    }
  }
}
