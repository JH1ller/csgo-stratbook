import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import MapPicker from '@/components/map-picker/map-picker.vue';
import StratList from '@/components/strat-list/strat-list.vue';
import FloatingAdd from '@/components/floating-add/floating-add.vue';
import CreationOverlay from '@/components/creation-overlay/creation-overlay.vue';
import FilterMenu from '@/components/filter-menu/filter-menu.vue';
import { Strat, StratTypes, Sides } from '@/services/models';

const filterModule = namespace('filter');
const mapModule = namespace('map');
const stratModule = namespace('strat');

@Component({
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
  private refreshInterval!: NodeJS.Timeout;
  @mapModule.State currentMap!: string;
  @stratModule.State strats!: Strat[];
  @filterModule.Action updatePlayerFilter!: (value: string) => void;
  @filterModule.Action updateTypeFilter!: (type: StratTypes | null) => void;
  @filterModule.Action updateNameFilter!: (name: string) => void;
  @filterModule.Action updateSideFilter!: (side: Sides | null) => void;
  @mapModule.Action updateCurrentMap!: (mapId: string) => void;
  @stratModule.Action fetchStrats!: () => void;
  @stratModule.Action updateStrat!: (payload: {
    stratId: string;
    changeObj: any;
  }) => void;
  @stratModule.Action createStrat!: (payload: any) => void;
  @stratModule.Action deleteStrat!: (stratId: string) => void;
  @stratModule.Action updateStep!: (payload: any) => void;
  @stratModule.Action addStep!: (payload: any) => void;
  @stratModule.Action deleteStep!: (stepId: string) => void;
  @filterModule.Action clearFilters!: () => void;

  private mounted() {
    this.refreshInterval = setInterval(() => this.fetchStrats(), 15000); // TODO: move interval value to cfg
  }

  private beforeDestroy() {
    clearInterval(this.refreshInterval);
  }

  private creationOverlaySubmitted(data: any) {
    if (!data.isEdit) {
      this.createStrat(data.strat);
    } else {
      this.updateStrat({
        stratId: data.stratId,
        changeObj: data.strat,
      });
    }
    this.hideCreationOverlay();
  }

  private showCreationOverlay(strat: Strat) {
    this.creationOverlayOpen = true;
    this.editStrat = strat._id ? strat : null;
    this.creationOverlayEditMode = strat._id ? true : false;
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
    this.updateStrat({ stratId, changeObj: { active } });
  }
}
