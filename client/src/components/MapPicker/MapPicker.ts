import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Map, MapID } from '@/api/models';
import { mapModule } from '@/store/namespaces';

@Component({})
export default class MapPicker extends Vue {
  @Prop() private currentMap!: string;
  private maps: Map[] = [
    {
      _id: MapID.Dust2,
      name: 'Dust 2',
      active: true
    },
    {
      _id: MapID.Mirage,
      name: 'Mirage',
      active: true
    },
    {
      _id: MapID.Overpass,
      name: 'Overpass',
      active: true
    },
    {
      _id: MapID.Nuke,
      name: 'Nuke',
      active: true
    },
    {
      _id: MapID.Vertigo,
      name: 'Vertigo',
      active: true
    },
    {
      _id: MapID.Inferno,
      name: 'Inferno',
      active: true
    },
    {
      _id: MapID.Train,
      name: 'Train',
      active: true
    }
  ]

  @Emit()
  private mapClicked(mapID: MapID) {
    return mapID;
  }

  private isCurrentMap(mapID: MapID) {
    return mapID === this.currentMap;
  }

  private getMapImage(mapID: MapID) {
    return `maps/${mapID.toLowerCase()}.jpg`
  }
}
