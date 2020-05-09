import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { Map, Strat, Step, Player, Sides } from '@/services/models';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class StepItem extends Vue {
  @Prop() private step!: Step;
  private editMode: boolean = false;

  @Emit()
  private deleteClicked() {
    return this.step._id;
  }

  private editClicked() {
    this.editMode = true;
  }
}
