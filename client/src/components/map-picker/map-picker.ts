import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Map, Strat, Step, Player } from '@/services/models';

@Component({})
export default class MapPicker extends Vue {
  @State('maps') maps!: Map[];
  @State('currentMap') currentMap!: string;

  @Emit()
  private mapClicked(mapId: string) {
    return mapId;
  }

  private isCurrentMap(mapId: string) {
    return mapId === this.currentMap;
  }
}
