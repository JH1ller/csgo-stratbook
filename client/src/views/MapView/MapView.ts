import { Component, Inject, Ref, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import ISketchTool from '@/components/SketchTool/SketchTool';
import ConnectionDialog from './components/ConnectionDialog.vue';
import StorageService from '@/services/storage.service';
import { appModule, authModule } from '@/store/namespaces';
import { Player } from '@/api/models/Player';
import VueContext from 'vue-context';
import { GameMap, gameMapTable } from '@/api/models/GameMap';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import { Log } from '@/utils/logger';
import { StoredStageState } from '@/components/SketchTool/types';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import TrackingService from '@/services/tracking.service';

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
  @appModule.Action private showToast!: (toast: Toast) => void;
  @Ref() mapPicker!: Vue & any;
  @Ref() sketchTool!: ISketchTool;
  GameMap = GameMap;
  mapTable = Object.entries(gameMapTable) as [GameMap, string][];

  map = GameMap.Dust2;
  userName = '';
  stratName = '';
  roomId = '';
  inputRoomId = '';
  showConnectionDialog = false;

  trackingService = TrackingService.getInstance();

  handleSubmit({ userName, stratName }: { userName: string; stratName: string }) {
    this.userName = userName;
    this.sketchTool.submitUserName(userName);
    if (stratName) {
      this.stratName = stratName;
      this.sketchTool.submitStratName(stratName);
    }
    this.storageService.set('draw-username', userName);
    this.showConnectionDialog = false;
  }

  handleRoomIdChange(roomId: string) {
    this.roomId = roomId;

    this.storageService.set('draw-room-id', roomId);
    if (!this.$route.params.roomId) {
      this.$router.replace({ path: `/map/${roomId}` });
    }
  }

  handleStratNameChange(stratName: string) {
    this.stratName = stratName;
  }

  handleUserNameChange(userName: string) {
    this.userName = userName;
  }

  handleMapChange(map: GameMap) {
    Log.info('MapView::changeMap', map);
    this.map = map;
    this.storageService.set('draw-map', map);
  }

  changeMap(map: GameMap) {
    this.sketchTool.changeMap(map);
  }

  get mapImage() {
    return `maps/${this.map.toLowerCase()}.jpg`;
  }

  get mapLabel() {
    return gameMapTable[this.map];
  }

  openContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.mapPicker.open(e);
  }

  created() {
    const userName = this.storageService.get('draw-username');
    if (this.profile?.name) {
      this.userName = this.profile.name;
    } else if (userName) {
      this.userName = userName;
    }
  }

  mounted() {
    const storageRoomId = this.storageService.get<string>('draw-room-id');

    if (this.$route.params.roomId) {
      this.sketchTool.connectToRoomId(this.$route.params.roomId);
      this.trackJoin();
    } else if (this.profile?.team) {
      this.sketchTool.connectToRoomId(this.profile.team.slice(0, 10));
    } else if (storageRoomId) {
      this.sketchTool.connectToRoomId(storageRoomId);
      this.trackJoin();
    } else {
      const previousData = this.storageService.get<StoredStageState>('draw-data');
      const previousMap = this.storageService.get<GameMap>('draw-map');
      if (previousMap) this.map = previousMap;
      if (previousData?.[this.map]) this.sketchTool.applyStageData(previousData[this.map]);
    }
  }

  trackJoin() {
    this.trackingService.track(`Action: Join Draw Room`, {
      map: this.map,
    });
  }

  joinWithLinkOrRoomId() {
    if (!this.inputRoomId) {
      this.showToast({ id: 'SketchTool::joinWithLinkOrRoomId', text: 'Please enter a room ID to join.' });
      return;
    }
    const targetRoomId = this.inputRoomId.includes('/')
      ? // can't use .at(-1) because Vetur doesn't support TS 4.6
        // and Volar doesn't support Vue 2 Class Components :(
        this.inputRoomId.split('/')[this.inputRoomId.split('/').length - 1]
      : this.inputRoomId;
    this.sketchTool.connect(targetRoomId);
    this.trackJoin();
  }
}
