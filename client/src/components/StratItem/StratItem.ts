import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import { Strat, Sides, StratTypes, Step } from '@/services/models';
import StepItem from '@/components/StepItem/StepItem.vue';
import { IStepItem } from '@/components/StepItem/StepItem';
import { filterModule } from '@/store/namespaces';

@Component({
  components: { StepItem },
})
export default class StratItem extends Vue {
  @Prop() private strat!: Strat;
  @Ref('step-elements') stepElements!: IStepItem[];
  @Ref('add-step') addStepElement!: IStepItem;
  @filterModule.State filters!: {
    // TODO: create interface for Filter
    name: string;
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };

  private get isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private get filteredSteps() {
    return this.strat.steps
      ? this.strat.steps.filter(step => {
          return this.filters.player ? step.actor === this.filters.player : true;
        })
      : [];
  }

  private handleStepEditEnabled() {
    if (this.stepElements) {
      this.stepElements.forEach(stepElement => stepElement.cancelEdit());
    }
    this.addStepElement.cancelEdit();
  }

  private openVideo() {
    if (process?.versions?.electron) {
      const { shell } = require('electron').remote;
      shell.openExternal(this.strat.videoLink as string);
    } else {
      window.open(this.strat.videoLink, '_blank');
    }
  }

  @Emit()
  private deleteStrat() {
    return this.strat._id;
  }

  @Emit()
  private editStrat() {
    return this.strat;
  }

  @Emit()
  private toggleActive(): Partial<Strat> {
    return { _id: this.strat._id, active: !this.strat.active };
  }

  @Emit()
  private updateStep(payload: Partial<Step>) {
    return { ...payload, strat: this.strat._id };
  }

  @Emit()
  private addStep(payload: Partial<Step>) {
    return { ...payload, strat: this.strat._id };
  }

  @Emit()
  private deleteStep(stepID: string) {
    return { stepID, stratID: this.strat._id };
  }
}
