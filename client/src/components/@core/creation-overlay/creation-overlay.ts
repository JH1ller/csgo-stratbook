import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Strat, StratTypes, Sides } from '@/services/models';

config.autoAddCss = false;
library.add(faBan, faCheck);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class CreationOverlay extends Vue {
  @Prop() strat!: Strat;
  @Prop() isEdit: boolean = false;
  private name: string = '';
  private type: StratTypes = StratTypes.BUYROUND;
  private side: Sides = Sides.T;
  private note: string = '';
  private videoLink: string = '';

  private mounted() {
    if (this.strat && this.isEdit) {
      this.mapToFields();
    }
  }

  @Emit()
  private submitClicked() {
    return {
      isEdit: this.isEdit,
      strat: {
        name: this.name,
        type: this.type,
        side: this.side,
        note: this.note,
        videoLink: this.videoLink,
      },
    };
  }

  @Emit()
  private cancelClicked() {}

  private mapToFields() {
    this.name = this.strat.name;
  }

  private isTSide() {
    return this.side === Sides.T;
  }

  private selectT() {
    this.side = Sides.T;
  }

  private selectCT() {
    this.side = Sides.CT;
  }
}
