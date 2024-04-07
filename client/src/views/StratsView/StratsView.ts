import { Component, Provide, Ref, Vue } from 'vue-property-decorator';
import MapPicker from '@/components/MapPicker/MapPicker.vue';
import StratList from '@/components/StratList/StratList.vue';
import FloatingButton from '@/components/FloatingButton/FloatingButton.vue';
import StratForm from '@/components/StratForm/StratForm.vue';
import StratFilterForm from '@/components/StratFilterForm/StratFilterForm.vue';
import FilterMenu from '@/components/FilterMenu/FilterMenu.vue';
import FilterButton from '@/components/FilterButton/FilterButton.vue';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { appModule, mapModule, stratModule, filterModule, teamModule, authModule } from '@/store/namespaces';
import { StratFilters } from '@/store/modules/filter';
import type { Strat } from '@/api/models/Strat';
import type { Player } from '@/api/models/Player';
import { StratTypes } from '@/api/models/StratTypes';
import { Sides } from '@/api/models/Sides';
import UtilityLightbox from '@/components/UtilityLightbox/UtilityLightbox.vue';
import type { Utility } from '@/api/models/Utility';
import ShortcutService from '@/services/shortcut.service';
import TrackingService from '@/services/tracking.service';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import { GameMap } from '@/api/models/GameMap';
import { Sort } from '@/utils/sortFunctions';
import { AccessRole } from '@/api/models/AccessRoles';

@Component({
  components: {
    MapPicker,
    StratList,
    FloatingButton,
    StratForm,
    StratFilterForm,
    FilterButton,
    UtilityLightbox,
    FilterMenu,
    SketchTool,
    BackdropDialog,
  },
})
export default class StratsView extends Vue {
  @Provide('lightbox') showLightboxFunc = this.showLightbox;

  @mapModule.State currentMap!: GameMap;
  @stratModule.State strats!: Strat[];
  @stratModule.State collapsedStrats!: string[];
  @stratModule.State editedStrats!: string[];
  @stratModule.State sort!: Sort;
  @stratModule.Getter sortedFilteredStratsOfCurrentMap!: Strat[];
  @filterModule.State stratFilters!: StratFilters;
  @filterModule.Getter activeStratFilterCount!: number;
  @teamModule.State teamMembers!: Player[];
  @teamModule.Getter isManager!: boolean;
  @authModule.State profile!: Player;
  @appModule.State gameMode!: boolean;

  @filterModule.Action updateStratContentFilter!: (value: string) => Promise<void>;
  @filterModule.Action updateStratTypeFilter!: (types: StratTypes[]) => Promise<void>;
  @filterModule.Action updateStratNameFilter!: (name: string) => Promise<void>;
  @filterModule.Action updateStratSideFilter!: (side: Sides | null) => Promise<void>;
  @filterModule.Action updateStratInactiveFilter!: (value: boolean) => Promise<void>;
  @filterModule.Action clearStratFilters!: () => Promise<void>;

  @authModule.Action updateProfile!: (formData: FormData) => Promise<void>;
  @mapModule.Action updateCurrentMap!: (mapID: GameMap) => Promise<void>;
  @stratModule.Action updateStrat!: (payload: Partial<Strat>) => Promise<void>;
  @stratModule.Action createStrat!: (payload: Partial<Strat>) => Promise<Strat>;
  @stratModule.Action deleteStrat!: (stratID: string) => Promise<void>;
  @stratModule.Action shareStrat!: (stratID: string) => Promise<void>;
  @stratModule.Action unshareStrat!: (stratID: string) => Promise<void>;
  @stratModule.Action collapseAll!: () => Promise<void>;
  @stratModule.Action expandAll!: () => Promise<void>;
  @stratModule.Action toggleStratCollapse!: (stratID: string) => Promise<void>;
  @stratModule.Action updateEdited!: (payload: { stratID: string; value: boolean }) => Promise<void>;
  @stratModule.Action updateSort!: (sort: Sort) => Promise<void>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @appModule.Action startGameMode!: () => Promise<void>;
  @appModule.Action exitGameMode!: () => Promise<void>;

  @Ref() stratList!: Vue;
  private shortcutService = ShortcutService.getInstance();

  private stratFormOpen = false;
  private stratFormEditMode = false;
  private editStrat: Strat | null = null;
  private lightboxOpen = false;
  private currentLightboxUtility: Utility | null = null;
  private filterMenuOpen = false;
  private drawToolOpen = false;
  private currentDrawToolStrat: Strat | null = null;
  private hasEditorFocus = false;
  private tutorialStrat: Strat | null = null;

  private Sort: typeof Sort = Sort;

  private trackingService = TrackingService.getInstance();

  private created() {
    this.shortcutService.add([
      {
        shortcut: 'Ctrl+Shift+E',
        handler: () => this.execShortcut(this.expandAll),
      },
      {
        shortcut: 'Ctrl+E',
        handler: () => this.execShortcut(this.collapseAll),
      },
      {
        shortcut: 'Ctrl+Shift+A',
        handler: () => this.execShortcut(this.showStratForm),
      },
      {
        shortcut: 'Ctrl+Shift+F',
        handler: () => this.execShortcut(this.toggleFilterMenu),
      },
      {
        shortcut: 'Ctrl+G',
        handler: () => this.execShortcut(this.toggleGameMode),
      },
      {
        shortcut: 'Ctrl+S',
        handler: () => this.execShortcut(this.toggleSort),
      },
    ]);
    // TODO: add map change shortcut
  }

  mounted() {
    const stratId = this.$route.params.stratId;
    if (stratId) {
      const strat = this.strats.find((strat) => strat._id === stratId);
      if (!strat) return;
      this.showDrawTool(strat);
    }
  }

  private beforeDestroy() {
    this.shortcutService.reset();
  }

  private execShortcut(action: () => unknown): boolean | void {
    if (!this.editedStrats.length && !this.stratFormOpen && !this.hasEditorFocus) {
      action();
      return true;
    }
  }

  private async stratFormSubmitted(data: Partial<Strat>) {
    if (data._id) {
      this.updateStrat(data);
    } else {
      const newStrat = await this.createStrat(data);
      if (!this.profile.completedTutorial) {
        this.tutorialStrat = newStrat;

        const dialogResult = await this.showDialog({
          key: 'strats-view/confirm-tutorial',
          text: `Hey there! Looks like you just created your first strat.<br>You can now edit the content of the strat by clicking the blinking box.<br>
              You can mention teammates with "<b>@</b>".<br>You can link utility from the nadebook with "<b>#</b>"<br>You can
              link weapons or equipment with "<b>/</b>".`,
          resolveBtn: 'OK',
          confirmOnly: true,
          htmlMode: true,
        });

        if (dialogResult) {
          const formData = new FormData();
          formData.append('completedTutorial', 'true');
          this.updateProfile(formData);
          this.trackingService.track('Action: Completed Tutorial');
        }
      }
    }
    this.hideStratForm();
  }

  private showStratForm(strat?: Strat) {
    this.stratFormOpen = true;
    this.filterMenuOpen = false;
    this.editStrat = strat?._id ? strat : null;
    this.stratFormEditMode = !!strat?._id;
  }

  private hideStratForm() {
    this.stratFormOpen = false;
  }

  private async requestDeleteStrat(stratID: string) {
    const dialogResult = await this.showDialog({
      key: 'strats-view/confirm-delete',
      text: 'Are you sure you want to delete this strat?',
    });
    if (dialogResult) {
      this.deleteStrat(stratID);
    }
  }

  private async requestShareStrat(stratID: string) {
    const dialogResult = await this.showDialog({
      key: 'strats-view/confirm-share',
      text: 'Do you want to create a share-link to let other teams add this strat to their stratbook?',
    });
    if (dialogResult) {
      this.shareStrat(stratID);
    }
  }

  private showLightbox(utility: Utility) {
    this.currentLightboxUtility = utility;
    this.lightboxOpen = true;
  }

  private hideLightbox() {
    this.currentLightboxUtility = null;
    this.lightboxOpen = false;
  }

  private showDrawTool(strat: Strat) {
    this.currentDrawToolStrat = strat;
    this.drawToolOpen = true;
    if (!this.$route.params.stratId) this.$router.replace({ params: { stratId: strat._id } });
    this.trackingService.track('Click: Show DrawTool', { strat: strat.name });
  }

  private closeDrawTool() {
    this.drawToolOpen = false;
    this.$router.replace({ path: '/strats' });
  }

  private toggleFilterMenu() {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  private toggleGameMode() {
    this.gameMode ? this.exitGameMode() : this.startGameMode();
    this.trackingService.track('Action: Toggle GameMode', { value: this.gameMode });
  }

  get readOnly(): boolean {
    return this.gameMode || (!this.isManager && this.profile.role !== AccessRole.EDITOR);
  }

  private get sortBtnIcon() {
    switch (this.sort) {
      case Sort.DateAddedASC:
        return 'sort-numeric-up-alt';
      case Sort.DateAddedDESC:
        return 'sort-numeric-down';
      case Sort.Manual:
        return 'sort';
    }
  }

  private async toggleSort() {
    let newSort: Sort;
    switch (this.sort) {
      case Sort.DateAddedASC:
        newSort = Sort.DateAddedDESC;
        break;
      case Sort.DateAddedDESC:
        newSort = Sort.Manual;
        break;
      case Sort.Manual:
        newSort = Sort.DateAddedASC;
    }
    await this.updateSort(newSort);
    // TODO: find better way
    this.stratList.$forceUpdate();
    this.trackingService.track('Action: Change Sort Direction', {
      direction: newSort,
    });
  }

  private applyStratTypeFilter(value: StratTypes) {
    this.updateStratTypeFilter([value]);
  }
}
