import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
const { remote } = require('electron');
import { Map, Strat, Step, Player } from '@/services/models';

@Component({
  components: {
  },
  computed: mapState(['currentStrats'])
})
export default class StratList extends Vue {

  private currentStrats!: Strat[];

}

