import { Component, Inject, Ref, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import ISketchTool from '@/components/SketchTool/SketchTool';
import ConnectionDialog from './components/ConnectionDialog.vue';
import StorageService from '@/services/storage.service';
import { appModule, authModule, stratModule } from '@/store/namespaces';
import { Player } from '@/api/models/Player';
import VueContext from 'vue-context';
import { GameMap, gameMapTable } from '@/api/models/GameMap';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import { Log } from '@/utils/logger';
import { StoredItemState } from '@/components/SketchTool/types';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import TrackingService from '@/services/tracking.service';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { Strat } from '@/api/models/Strat';
import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';

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
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @stratModule.Action createStrat!: (payload: Partial<Strat>) => Promise<Strat>;
  @Ref() mapPicker!: Vue & any;
  @Ref() sketchTool!: ISketchTool;
  GameMap = GameMap;
  mapTable = Object.entries(gameMapTable) as [GameMap, string][];

  map = GameMap.Dust2;
  userName = '';
  stratName = '';
  roomId = '';
  inputRoomId = '';
  stratId: string | null = null;
  showConnectionDialog = false;

  trackingService = TrackingService.getInstance();

  async handleSubmit({ userName, stratName }: { userName: string; stratName: string }) {
    this.userName = userName;
    this.sketchTool.submitUserName(userName);

    if (!this.stratName && stratName && this.profile) {
      const dialogResult = await this.showDialog({
        key: 'map-view/submit-name',
        text: `You added a name to your strat. Would you like to save it to your stratbook? This will also redirect you to the strats page.`,
        resolveBtn: 'OK',
        rejectBtn: 'Cancel',
      });

      if (dialogResult) {
        const result = await this.createStrat({
          name: stratName,
          map: this.map,
          side: Sides.T,
          types: [StratTypes.PISTOL, StratTypes.BUYROUND, StratTypes.FORCE],
          drawData: this.sketchTool.itemState,
        });
        console.log(result);
        this.$router.push({ path: `/strats/${result._id}` });
      }
    }

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
    return require(`@/assets/images/maps/${this.map.toLowerCase()}.webp`);
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
      const previousData = this.storageService.get<StoredItemState>('draw-data');
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
    const targetRoomId = this.inputRoomId.includes('/') ? this.inputRoomId.split('/').at(-1) : this.inputRoomId;
    this.sketchTool.connect(targetRoomId);
    this.trackJoin();
  }
}
