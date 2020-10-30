import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Map } from '@/services/models';
import { mapModule } from '@/store/namespaces';

@Component({})
export default class MapPicker extends Vue {
  @mapModule.State maps!: Map[];
  @mapModule.State currentMap!: string;

  @Emit()
  private mapClicked(mapId: string) {
    return mapId;
  }

  private isCurrentMap(mapId: string) {
    return mapId === this.currentMap;
  }
}
