import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
const { remote } = require('electron');
import { Map, Strat, Step, Player } from '@/services/models';

@Component({
  components: {
  },
})
export default class StratItem extends Vue {

  private strat!: Strat;

}

