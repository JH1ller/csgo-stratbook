import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
const { remote } = require("electron");
import { Map, Strat, Step, Player, Sides } from "@/services/models";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faTrashAlt, faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

config.autoAddCss = false;
library.add(faEdit, faTrashAlt, faBan);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {},
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

  @Emit()
  private deleteClicked() {
    if (!this.inDeletionQuestion) {
      this.inDeletionQuestion = true;
    } else {
      return this.strat._id;
    }
  }

  private cancelDeletion() {
    this.inDeletionQuestion = false;
  }
}
