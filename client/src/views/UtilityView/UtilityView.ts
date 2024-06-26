import { Component, Vue } from 'vue-property-decorator';
import MapPicker from '@/components/MapPicker/MapPicker.vue';
import FloatingButton from '@/components/FloatingButton/FloatingButton.vue';
import UtilityForm from '@/components/UtilityForm/UtilityForm.vue';
import UtilityList from '@/components/UtilityList/UtilityList.vue';
import UtilityLightbox from '@/components/UtilityLightbox/UtilityLightbox.vue';
import FilterButton from '@/components/FilterButton/FilterButton.vue';
import UtilityFilterForm from '@/components/UtilityFilterForm/UtilityFilterForm.vue';
import FilterMenu from '@/components/FilterMenu/FilterMenu.vue';
import { appModule, authModule, filterModule, mapModule, teamModule, utilityModule } from '@/store/namespaces';
import { Utility } from '@/api/models/Utility';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Sides } from '@/api/models/Sides';
import { UtilityFilters } from '@/store/modules/filter';
import ShortcutService from '@/services/shortcut.service';
import { GameMap } from '@/api/models/GameMap';
import { AccessRole } from '@/api/models/AccessRoles';
import { Player } from '@/api/models/Player';

@Component({
  components: {
    MapPicker,
    FloatingButton,
    UtilityForm,
    UtilityList,
    UtilityLightbox,
    FilterButton,
    UtilityFilterForm,
    FilterMenu,
  },
})
export default class UtilityView extends Vue {
  @mapModule.State currentMap!: GameMap;
  @utilityModule.Getter sortedFilteredUtilitiesOfCurrentMap!: Utility[];
  @mapModule.Action updateCurrentMap!: (mapID: GameMap) => Promise<void>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @teamModule.Getter isManager!: boolean;
  @authModule.State profile!: Player;

  @filterModule.State utilityFilters!: UtilityFilters;
  @filterModule.Getter activeUtilityFilterCount!: number;
  @filterModule.Action updateUtilityTypeFilter!: (type: UtilityTypes | null) => Promise<void>;
  @filterModule.Action updateUtilityNameFilter!: (name: string) => Promise<void>;
  @filterModule.Action updateUtilitySideFilter!: (side: Sides | null) => Promise<void>;
  @filterModule.Action clearUtilityFilters!: () => Promise<void>;

  @utilityModule.Action updateUtility!: (payload: FormData) => Promise<void>;
  @utilityModule.Action createUtility!: (payload: FormData) => Promise<void>;
  @utilityModule.Action deleteUtility!: (utilityID: string) => Promise<void>;
  @utilityModule.Action shareUtility!: (utilityID: string) => Promise<void>;
  @utilityModule.Action unshareUtility!: (utilityID: string) => Promise<void>;

  shortcutService = ShortcutService.getInstance();

  utilityFormOpen = false;
  utilityFormEditMode = false;
  editUtility: Utility | null = null;
  lightboxOpen = false;
  currentLightboxUtility: Utility | null = null;
  filterMenuOpen = false;

  get readOnly(): boolean {
    return !this.isManager && this.profile.role !== AccessRole.EDITOR;
  }

  created() {
    this.shortcutService.add([
      {
        shortcut: 'Ctrl+Shift+F',
        handler: () => this.execShortcut(this.toggleFilterMenu),
      },
      {
        shortcut: 'Ctrl+Shift+A',
        handler: () => this.execShortcut(this.showUtilityForm),
      },
    ]);
  }

  beforeDestroy() {
    this.shortcutService.reset();
  }

  execShortcut(action: () => unknown): boolean | void {
    if (!this.utilityFormOpen) {
      action();
      return true;
    }
  }

  utilityFormSubmitted(data: FormData) {
    if (data.has('_id')) {
      this.updateUtility(data);
    } else {
      this.createUtility(data);
    }
    this.hideUtilityForm();
  }

  async requestDeleteUtility(utility: Utility) {
    const dialogResult = await this.showDialog({
      key: 'utility-view/confirm-delete',
      text: 'Are you sure you want to delete this utility?',
    });
    if (dialogResult) {
      this.deleteUtility(utility._id);
    }
  }

  async requestShareUtility(utility: Utility) {
    const dialogResult = await this.showDialog({
      key: 'utility-view/confirm-share',
      text: 'Do you want to create a share-link to let other teams add this utility to their stratbook?',
    });
    if (dialogResult) {
      this.shareUtility(utility._id);
    }
  }

  showUtilityForm(utility?: Utility) {
    this.utilityFormOpen = true;
    this.filterMenuOpen = false;
    this.editUtility = utility?._id ? utility : null;
    this.utilityFormEditMode = !!utility?._id;
  }

  hideUtilityForm() {
    this.utilityFormOpen = false;
  }

  showLightbox(utility: Utility) {
    this.currentLightboxUtility = utility;
    this.lightboxOpen = true;
  }

  hideLightbox() {
    this.currentLightboxUtility = null;
    this.lightboxOpen = false;
  }

  toggleFilterMenu() {
    this.filterMenuOpen = !this.filterMenuOpen;
  }
}
