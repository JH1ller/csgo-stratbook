import { Component, Vue } from 'vue-property-decorator';
import MapPicker from '@/components/MapPicker/MapPicker.vue';
import FloatingAdd from '@/components/FloatingAdd/FloatingAdd.vue';
import UtilityForm from '@/components/UtilityForm/UtilityForm.vue';
import UtilityList from '@/components/UtilityList/UtilityList.vue';
import UtilityLightbox from '@/components/UtilityLightbox/UtilityLightbox.vue';
import FilterButton from '@/components/FilterButton/FilterButton.vue';
import UtilityFilterMenu from '@/components/UtilityFilterMenu/UtilityFilterMenu.vue';
import { appModule, filterModule, mapModule, utilityModule } from '@/store/namespaces';
import { MapID } from '@/components/MapPicker/MapPicker';
import { Utility } from '@/api/models/Utility';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Sides } from '@/api/models/Sides';
import { UtilityFilters } from '@/store/modules/filter';

@Component({
  components: {
    MapPicker,
    FloatingAdd,
    UtilityForm,
    UtilityList,
    UtilityLightbox,
    FilterButton,
    UtilityFilterMenu,
  },
})
export default class UtilityView extends Vue {
  @mapModule.State currentMap!: MapID;
  @utilityModule.Getter utilitiesOfCurrentMap!: Utility[];
  @mapModule.Action updateCurrentMap!: (mapID: MapID) => Promise<void>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;

  @filterModule.State utilityFilters!: UtilityFilters;
  @filterModule.Action updateUtilityTypeFilter!: (type: UtilityTypes | null) => Promise<void>;
  @filterModule.Action updateUtilityNameFilter!: (name: string) => Promise<void>;
  @filterModule.Action updateUtilitySideFilter!: (side: Sides | null) => Promise<void>;
  @filterModule.Action clearUtilityFilters!: () => Promise<void>;

  @utilityModule.Action updateUtility!: (payload: FormData) => Promise<void>;
  @utilityModule.Action createUtility!: (payload: FormData) => Promise<void>;
  @utilityModule.Action deleteUtility!: (utilityID: string) => Promise<void>;
  @utilityModule.Action shareUtility!: (utilityID: string) => Promise<void>;
  @utilityModule.Action unshareUtility!: (utilityID: string) => Promise<void>;

  private utilityFormOpen: boolean = false;
  private utilityFormEditMode: boolean = false;
  private editUtility: Utility | null = null;
  private lightboxOpen: boolean = false;
  private currentLightboxUtility: Utility | null = null;
  private filterMenuOpen: boolean = false;

  private toggleFilterMenu() {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  private utilityFormSubmitted(data: FormData) {
    if (data.has('_id')) {
      this.updateUtility(data);
    } else {
      this.createUtility(data);
    }
    this.hideUtilityForm();
  }

  private requestDeleteUtility(utilityID: string) {
    this.showDialog({
      key: 'utility-view/confirm-delete',
      text: 'Are you sure you want to delete this utility?',
    }).then(() => this.deleteUtility(utilityID));
  }

  private requestShareUtility(utilityID: string) {
    this.showDialog({
      key: 'utility-view/confirm-share',
      text: 'Do you want to create a share-link to let other teams add this utility to their stratbook?',
    }).then(() => this.shareUtility(utilityID));
  }

  private showUtilityForm(utility: Utility) {
    this.utilityFormOpen = true;
    this.editUtility = utility._id ? utility : null;
    this.utilityFormEditMode = utility._id ? true : false;
  }

  private hideUtilityForm() {
    this.utilityFormOpen = false;
  }

  private showLightbox(utility: Utility) {
    this.currentLightboxUtility = utility;
    this.lightboxOpen = true;
  }

  private hideLightbox() {
    this.currentLightboxUtility = null;
    this.lightboxOpen = false;
  }

  private get sortedUtilities(): Utility[] {
    return this.utilitiesOfCurrentMap.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
