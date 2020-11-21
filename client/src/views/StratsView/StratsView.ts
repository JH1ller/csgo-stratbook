import { Component, Vue, Watch } from 'vue-property-decorator';
import MapPicker from '@/components/MapPicker/MapPicker.vue';
import StratList from '@/components/StratList/StratList.vue';
import FloatingAdd from '@/components/FloatingAdd/FloatingAdd.vue';
import CreationOverlay from '@/components/CreationOverlay/CreationOverlay.vue';
import FilterMenu from '@/components/FilterMenu/FilterMenu.vue';
import { Strat, StratTypes, Sides, Player } from '@/api/models';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { appModule, mapModule, stratModule, filterModule, teamModule } from '@/store/namespaces';
import { Filters } from '@/store/modules/filter';

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
  @mapModule.State stratMap!: string;
  @stratModule.Getter stratsOfCurrentMap!: Strat[];
  @filterModule.State filters!: Filters;
  @teamModule.State teamMembers!: Player[];
  
  @filterModule.Action updatePlayerFilter!: (value: string) => Promise<void>;
  @filterModule.Action updateTypeFilter!: (type: StratTypes | null) => Promise<void>;
  @filterModule.Action updateNameFilter!: (name: string) => Promise<void>;
  @filterModule.Action updateSideFilter!: (side: Sides | null) => Promise<void>;
  @mapModule.Action updateStratMap!: (mapId: string) => Promise<void>;
  @stratModule.Action fetchStrats!: () => Promise<void>;
  @stratModule.Action updateStrat!: (payload: Partial<Strat>) => Promise<void>;
  @stratModule.Action createStrat!: (payload: Partial<Strat>) => Promise<void>;
  @stratModule.Action deleteStrat!: (stratId: string) => Promise<void>;
  @stratModule.Action shareStrat!: (stratId: string) => Promise<void>;
  @stratModule.Action unshareStrat!: (stratId: string) => Promise<void>;
  @filterModule.Action clearFilters!: () => Promise<void>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;

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

  private requestDeleteStrat(stratID: string) {
    this.showDialog({
      key: 'strats-view/confirm-delete',
      text: 'Are you sure you want to delete this strat?'
    }).then(() => this.deleteStrat(stratID));
  }

  private requestShareStrat(stratID: string) {
    this.showDialog({
      key: 'strats-view/confirm-share',
      text: 'Do you want to create a share-link to let other teams add this strat to their stratbook?'
    }).then(() => this.shareStrat(stratID));
  }

  private updateContent(payload: Partial<Strat>) {
    this.updateStrat(payload);
  }
}
