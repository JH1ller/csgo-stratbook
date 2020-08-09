import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Map } from '@/services/models';

const mapModule = namespace('map');

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
