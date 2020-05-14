import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MapPicker from '@/components/map-picker/map-picker.vue';
import StratList from '@/components/strat-list/strat-list.vue';
import FloatingAdd from '@/components/floating-add/floating-add.vue';
import CreationOverlay from '@/components/creation-overlay/creation-overlay.vue';

@Component({
  name: 'StratsView',
  components: {
    MapPicker,
    StratList,
    FloatingAdd,
    CreationOverlay,
  },
  computed: mapState(['currentMap']),
})
export default class Home extends Vue {
  private creationOverlayOpen: boolean = false;
  private creationOverlayEditMode: boolean = false;
  private currentMap!: boolean;

  private updateCurrentMap(mapId: string) {
    this.$store.dispatch('updateCurrentMap', mapId);
  }

  private deleteStrat(stratId: string) {
    this.$store.dispatch('deleteStrat', stratId);
  }

  private creationOverlaySubmitted(data: any) {
    if (!data.isEdit) {
      this.$store.dispatch('createStrat', data.strat);
    }
    this.hideCreationOverlay();
  }

  private showCreationOverlay(editMode: boolean) {
    this.creationOverlayOpen = true;
    this.creationOverlayEditMode = editMode;
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
  }: {
    stepId: string;
    description: string;
  }) {
    this.$store.dispatch('updateStep', { stepId, changeObj: { description } });
  }
}
