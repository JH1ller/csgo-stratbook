import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const { shell } = require('electron').remote;
import { Strat, Sides, StratTypes } from '@/services/models';
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

const filterModule = namespace('filter');

@Component({
  components: { StepItem },
})
export default class StratItem extends Vue {
  @Prop() private strat!: Strat;
  @Ref('step-elements') stepElements!: IStepItem[];
  @Ref('add-step') addStepElement!: IStepItem;
  @filterModule.State filters!: {
    name: string;
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };

  private inDeletionQuestion: boolean = false;

  private get isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private get filteredSteps() {
    return this.strat.steps
      ? this.strat.steps.filter(step => {
          return this.filters.player
            ? step.actor === this.filters.player
            : true;
        })
      : [];
  }

  private handleStepEditEnabled() {
    if (this.stepElements) {
      this.stepElements.forEach(stepElement => stepElement.cancelEdit());
    }
    this.addStepElement.cancelEdit();
  }

  private deleteClicked() {
    if (!this.inDeletionQuestion) {
      this.inDeletionQuestion = true;
    } else {
      this.inDeletionQuestion = false;
      this.$emit('delete-clicked', this.strat._id);
    }
  }

  private cancelDeletion() {
    this.inDeletionQuestion = false;
  }

  private openVideo() {
    shell.openExternal(this.strat.videoLink as string);
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
    return { ...payload, strat: this.strat._id };
  }

  @Emit()
  private addStep(payload: any) {
    return { ...payload, strat: this.strat._id };
  }

  @Emit()
  private deleteStep(stepId: string) {
    return { stepId, strat: this.strat._id };
  }
}
