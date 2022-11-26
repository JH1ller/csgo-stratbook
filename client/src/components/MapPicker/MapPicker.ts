import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import { GameMap, gameMapTable } from '@/api/models/GameMap';

@Component({
  components: {
    SmartImage,
  },
})
export default class MapPicker extends Vue {
  @Prop() private currentMap!: GameMap;

  maps = gameMapTable;

  @Emit()
  private mapClicked(map: GameMap) {
    return map;
  }

  private isCurrentMap(map: GameMap) {
    return map === this.currentMap;
  }

  private getMapImage(map: GameMap) {
    return require(`@/assets/images/maps/${map.toLowerCase()}.webp`);
  }
}
