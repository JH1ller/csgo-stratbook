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
  // TODO: remove any from params
  @filterModule.Action updatePlayerFilter!: (value: string) => Promise<void>;
  @filterModule.Action updateTypeFilter!: (type: StratTypes | null) => Promise<void>;
  @filterModule.Action updateNameFilter!: (name: string) => Promise<void>;
  @filterModule.Action updateSideFilter!: (side: Sides | null) => Promise<void>;
  @mapModule.Action updateCurrentMap!: (mapId: string) => Promise<void>;
  @stratModule.Action fetchStrats!: () => Promise<void>;
  @stratModule.Action updateStrat!: (payload: Partial<Strat>) => Promise<void>;
  @stratModule.Action createStrat!: (payload: any) => Promise<void>;
  @stratModule.Action deleteStrat!: (stratId: string) => Promise<void>;
  @stratModule.Action updateStep!: (payload: any) => Promise<void>;
  @stratModule.Action createStep!: (payload: any) => Promise<void>;
  @stratModule.Action deleteStep!: (stepId: string) => Promise<void>;
  @filterModule.Action clearFilters!: () => Promise<void>;

  private mounted() {
    this.refreshInterval = setInterval(() => this.fetchStrats(), 15000); // TODO: move interval value to cfg
  }

  private beforeDestroy() {
    clearInterval(this.refreshInterval);
  }

  private creationOverlaySubmitted(data: Partial<Strat>) {
    if (data._id) {
      this.updateStrat(data);
    } else {
      this.createStrat(data);
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

  private toggleStratActive(data: Partial<Strat>) {
    this.updateStrat(data);
  }
}
