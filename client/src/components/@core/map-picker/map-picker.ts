import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
const { remote } = require('electron');
import { Map, Strat, Step, Player } from '@/services/models';

@Component({
  components: {
  },
  computed: mapState(['maps', 'currentStrats'])
})
export default class MapPicker extends Vue {

  maps!: Map[];
  currentStrats!: Strat[];

  mapClicked(mapId: string) {
    this.$store.dispatch('updateCurrentMap', mapId);
  }
}

