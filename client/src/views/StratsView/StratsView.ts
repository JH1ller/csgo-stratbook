import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MapPicker from '@/components/map-picker/map-picker.vue';
import StratList from '@/components/strat-list/strat-list.vue';
import FloatingAdd from '@/components/floating-add/floating-add.vue';
import CreationOverlay from '@/components/creation-overlay/creation-overlay.vue';
import { Equipment, Strat } from '@/services/models';

@Component({
  name: 'StratsView',
  components: {
    MapPicker,
    StratList,
    FloatingAdd,
    CreationOverlay,
  },
  computed: mapState(['currentMap', 'currentStrats']),
})
export default class StratsView extends Vue {
  private creationOverlayOpen: boolean = false;
  private creationOverlayEditMode: boolean = false;
  private editStrat: Strat | null = null;
  private currentMap!: string;
  private currentStrats!: Strat[];

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
    if (strat) {
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

  private updateStep({
    stepId,
    description,
    equipment,
  }: {
    stepId: string;
    description: string;
    equipment: Equipment;
  }) {
    this.$store.dispatch('updateStep', {
      stepId,
      changeObj: { description, equipment },
    });
  }

  private addStep({
    description,
    equipment,
    stratId,
  }: {
    description: string;
    equipment: Equipment;
    stratId: string;
  }) {
    this.$store.dispatch('addStep', {
      stratId,
      payload: { description, equipment },
    });
  }
}
