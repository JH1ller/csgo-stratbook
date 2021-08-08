import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import SmartImage from '@/components/SmartImage/SmartImage.vue';

export enum MapID {
  Dust2 = 'DUST_2',
  Mirage = 'MIRAGE',
  Overpass = 'OVERPASS',
  Nuke = 'NUKE',
  Vertigo = 'VERTIGO',
  Inferno = 'INFERNO',
  Train = 'TRAIN',
  Ancient = 'ANCIENT',
}
export interface Map {
  _id: MapID;
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
    {
      _id: MapID.Ancient,
      name: 'Ancient',
      active: true,
    },
    {
      _id: MapID.Ancient,
      name: 'Ancient',
      active: true,
    },
    {
      _id: MapID.Ancient,
      name: 'Ancient',
      active: true,
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
