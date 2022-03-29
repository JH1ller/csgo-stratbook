import { Component, Inject, Ref, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import ConnectionDialog from './components/ConnectionDialog.vue';
import StorageService from '@/services/storage.service';
import { authModule } from '@/store/namespaces';
import { Player } from '@/api/models/Player';
import VueContext from 'vue-context';
import { GameMap, gameMapTable } from '@/api/models/GameMap';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import { Log } from '@/utils/logger';

@Component({
  components: {
    SketchTool,
    ConnectionDialog,
    VueContext,
    SmartImage,
  },
})
export default class MapView extends Vue {
  @Inject() storageService!: StorageService;
  @authModule.State profile!: Player;
  @Ref() mapPicker!: Vue & any;
  GameMap = GameMap;
  mapTable = gameMapTable;

  map = GameMap.Dust2;
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

  changeMap(map: GameMap) {
    Log.info('MapView::changeMap', map);
    this.map = map;
  }

  get mapImage() {
    return `maps/${this.map.toLowerCase()}.jpg`;
  }

  openContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.mapPicker.open(e);
  }

  mounted() {
    const userName = this.storageService.get('draw-username');
    if (this.profile?.name) {
      this.userName = this.profile.name;
    } else if (userName) {
      this.userName = userName;
    }

    const storageRoomId = this.storageService.get<string>('draw-room-id');

    if (this.$route.params.roomId) {
      this.changeRoomId(this.$route.params.roomId);
    } else if (this.profile?.team) {
      this.changeRoomId(this.profile.team.slice(0, 10));
    } else if (storageRoomId) {
      this.changeRoomId(storageRoomId);
    } else {
      // const previousData = this.storageService.get<StageState>('draw-data');
      // TODO: apply previousData
    }
  }
}
