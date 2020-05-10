import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
const { shell } = require('electron').remote;
import { Map, Strat, Step, Player, Sides } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faTrashAlt,
  faBan,
  faFilm,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import StepItem from '@/components/@core/step-item/step-item.vue';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt, faBan, faFilm);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: { StepItem },
})
export default class StratItem extends Vue {
  @Prop() private strat!: Strat;

  private inDeletionQuestion: boolean = false;

  private isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private isActive(): boolean {
    return this.strat.active;
  }
  /* 
  mounted() {
    this.$forceUpdate();
    document.addEventListener('keydown', e => {
      if (e.key === 'u' && e.ctrlKey) {
        this.$forceUpdate();
      }
    });
  } */

  @Emit()
  private deleteClicked() {
    if (!this.inDeletionQuestion) {
      this.inDeletionQuestion = true;
    } else {
      this.inDeletionQuestion = false;
      return this.strat._id;
    }
  }

  private cancelDeletion() {
    this.inDeletionQuestion = false;
  }

  private openVideo() {
    shell.openExternal(this.strat.videoLink);
  }

  @Emit()
  private toggleActive() {
    return { stratId: this.strat._id, active: !this.strat.active };
  }
}
