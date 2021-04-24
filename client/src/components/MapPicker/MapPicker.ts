import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import { GameMap } from '@/api';
export interface MapDisplay {
  id: GameMap;
  name: string;
}

@Component({
  components: {
    SmartImage,
  },
})
export default class MapPicker extends Vue {
  @Prop() private currentMap!: string;
  private maps: MapDisplay[] = [
    {
      id: GameMap.Dust2,
      name: 'Dust 2',
    },
    {
      id: GameMap.Mirage,
      name: 'Mirage',
    },
    {
      id: GameMap.Overpass,
      name: 'Overpass',
    },
    {
      id: GameMap.Nuke,
      name: 'Nuke',
    },
    {
      id: GameMap.Vertigo,
      name: 'Vertigo',
    },
    {
      id: GameMap.Inferno,
      name: 'Inferno',
    },
    {
      id: GameMap.Train,
      name: 'Train',
    },
  ];

  @Emit()
  private mapClicked(map: GameMap) {
    return map;
  }

  private isCurrentMap(map: GameMap) {
    return map === this.currentMap;
  }

  private getMapImage(map: GameMap) {
    return `maps/${map.toLowerCase()}.jpg`;
  }
}
