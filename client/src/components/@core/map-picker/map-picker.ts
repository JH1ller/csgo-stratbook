import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
const { remote } = require('electron');
import { Map, Strat, Step, Player } from '@/services/models';

@Component({
  components: {
  },
  computed: mapState(['maps', 'currentMap'])
})
export default class MapPicker extends Vue {

  private maps!: Map[];
  private currentMap!: string;

  @Emit()
  private mapClicked(mapId: string) {
    return mapId;
  }

  private isCurrentMap(mapId: string) {
    return mapId === this.currentMap;
  }
}

