import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
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
import StepItem from '@/components/step-item/step-item.vue';
import { IStepItem } from '@/components/step-item/step-item';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt, faBan, faFilm);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: { StepItem },
})
export default class StratItem extends Vue {
  @Prop() private strat!: Strat;
  @Ref('step-elements') stepElements!: IStepItem[];
  @Ref('add-step') addStepElement!: IStepItem;

  private inDeletionQuestion: boolean = false;

  private isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private isActive(): boolean {
    return this.strat.active;
  }

  private handleStepEditEnabled() {
    if (this.stepElements) {
      this.stepElements.forEach(stepElement => stepElement.cancelEdit());
    }
    this.addStepElement.cancelEdit();
  }

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
  private editStrat() {
    return this.strat;
  }

  @Emit()
  private toggleActive() {
    return { stratId: this.strat._id, active: !this.strat.active };
  }

  @Emit()
  private updateStep(payload: {}) {
    return payload;
  }

  @Emit()
  private addStep(payload: any) {
    return { ...payload, strat: this.strat._id };
  }
}
