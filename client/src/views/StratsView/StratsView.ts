import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import MapPicker from '@/components/map-picker/map-picker.vue';
import StratList from '@/components/strat-list/strat-list.vue';
import FloatingAdd from '@/components/floating-add/floating-add.vue';
import CreationOverlay from '@/components/creation-overlay/creation-overlay.vue';
import FilterMenu from '@/components/filter-menu/filter-menu.vue';
import { Equipment, Strat, StratTypes, Sides } from '@/services/models';

@Component({
  name: 'StratsView',
  components: {
    MapPicker,
    StratList,
    FloatingAdd,
    CreationOverlay,
    FilterMenu,
  },
})
export default class StratsView extends Vue {
  private creationOverlayOpen: boolean = false;
  private creationOverlayEditMode: boolean = false;
  private editStrat: Strat | null = null;
  @State currentMap!: string;
  @State currentStrats!: Strat[];
  @Action updatePlayerFilter!: (value: string) => {};
  @Action updateTypeFilter!: (type: StratTypes | null) => {};
  @Action updateNameFilter!: (name: string) => {};
  @Action updateSideFilter!: (side: Sides | null) => {};

  private updateCurrentMap(mapId: string) {
    this.$store.dispatch('updateCurrentMap', mapId);
  }

  private deleteStrat(stratId: string) {
    this.$store.dispatch('deleteStrat', stratId);
  }

  private creationOverlaySubmitted(data: any) {
    if (!data.isEdit) {
      this.$store.dispatch('createStrat', data.strat);
    } else {
      this.$store.dispatch('updateStrat', {
        stratId: data.stratId,
        changeObj: data.strat,
      });
    }
    this.hideCreationOverlay();
  }

  private showCreationOverlay(strat: Strat) {
    this.creationOverlayOpen = true;
    if (strat._id) {
      this.editStrat = strat;
      this.creationOverlayEditMode = true;
    }
  }

  private hideCreationOverlay() {
    this.creationOverlayOpen = false;
  }

  private toggleStratActive({
    stratId,
    active,
  }: {
    stratId: string;
    active: boolean;
  }) {
    this.$store.dispatch('updateStrat', { stratId, changeObj: { active } });
  }

  private updateStep(payload: {}) {
    this.$store.dispatch('updateStep', payload);
  }

  private addStep(payload: {}) {
    this.$store.dispatch('addStep', payload);
  }

  private deleteStep(stepId: string) {
    this.$store.dispatch('deleteStep', stepId);
  }
}
