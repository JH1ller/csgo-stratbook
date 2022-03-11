import { Component, Inject, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import ConnectionDialog from './components/ConnectionDialog.vue';
import StorageService from '@/services/storage.service';
import { StageState } from '@/components/SketchTool/types';

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
  roomId = '';
  showConnectionDialog = false;

  handleSubmit({ userName, stratName }: { userName: string; stratName: string }) {
    this.userName = userName;
    this.stratName = stratName;
    this.storageService.set('draw-username', userName);
    this.showConnectionDialog = false;
  }

  changeRoomId(roomId: string) {
    this.roomId = roomId;

    this.storageService.set('draw-room-id', roomId);
    if (!this.$route.params.roomId) {
      this.$router.replace({ path: `/map/${roomId}` });
    }
  }

  changeStratName(stratName: string) {
    this.stratName = stratName;
  }

  mounted() {
    const userName = this.storageService.get('draw-username');
    if (userName) {
      this.userName = userName;
    }

    const storageRoomId = this.storageService.get<string>('draw-room-id');

    if (this.$route.params.roomId) {
      this.changeRoomId(this.$route.params.roomId);
    } else if (storageRoomId) {
      this.changeRoomId(storageRoomId);
    } else {
      const previousData = this.storageService.get<StageState>('draw-data');
      // TODO: apply previousData
    }
  }
}
