import { Component, Provide, Ref, Vue } from 'vue-property-decorator';
import MapPicker from '@/components/MapPicker/MapPicker.vue';
import StratList from '@/components/StratList/StratList.vue';
import FloatingButton from '@/components/FloatingButton/FloatingButton.vue';
import StratForm from '@/components/StratForm/StratForm.vue';
import StratFilterForm from '@/components/StratFilterForm/StratFilterForm.vue';
import FilterMenu from '@/components/FilterMenu/FilterMenu.vue';
import FilterButton from '@/components/FilterButton/FilterButton.vue';
import DrawTool from '@/components/DrawTool/DrawTool.vue';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { appModule, mapModule, stratModule, filterModule, teamModule, authModule } from '@/store/namespaces';
import { StratFilters } from '@/store/modules/filter';
import { Strat } from '@/api/models/Strat';
import { Player } from '@/api/models/Player';
import { StratTypes } from '@/api/models/StratTypes';
import { Sides } from '@/api/models/Sides';
import { MapID } from '@/components/MapPicker/MapPicker';
import UtilityLightbox from '@/components/UtilityLightbox/UtilityLightbox.vue';
import { Utility } from '@/api/models/Utility';
import { catchPromise } from '@/utils/catchPromise';
import ShortcutService from '@/services/shortcut.service';
import { Sort } from '@/store/modules/strat';
import TrackingService from '@/services/tracking.service';

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
    DrawTool,
  },
})
export default class StratsView extends Vue {
  @Provide('lightbox') showLightboxFunc = this.showLightbox;

  @mapModule.State currentMap!: MapID;
  @stratModule.State collapsedStrats!: string[];
  @stratModule.State editedStrats!: string[];
  @stratModule.State sort!: Sort;
  @stratModule.Getter sortedFilteredStratsOfCurrentMap!: Strat[];
  @filterModule.State stratFilters!: StratFilters;
  @filterModule.Getter activeStratFilterCount!: number;
  @teamModule.State teamMembers!: Player[];
  @authModule.State profile!: Player;
  @appModule.State gameMode!: boolean;

  @filterModule.Action updateStratContentFilter!: (value: string) => Promise<void>;
  @filterModule.Action updateStratTypeFilter!: (type: StratTypes | null) => Promise<void>;
  @filterModule.Action updateStratNameFilter!: (name: string) => Promise<void>;
  @filterModule.Action updateStratSideFilter!: (side: Sides | null) => Promise<void>;
  @filterModule.Action clearStratFilters!: () => Promise<void>;

  @authModule.Action updateProfile!: (formData: FormData) => Promise<void>;
  @mapModule.Action updateCurrentMap!: (mapID: MapID) => Promise<void>;
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
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;
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
        shortcut: 'E',
        handler: () => this.execShortcut(this.expandAll),
      },
      {
        shortcut: 'C',
        handler: () => this.execShortcut(this.collapseAll),
      },
      {
        shortcut: 'Plus',
        handler: () => this.execShortcut(this.showStratForm),
      },
      {
        shortcut: 'F',
        handler: () => this.execShortcut(this.toggleFilterMenu),
      },
      {
        shortcut: 'Ctrl+F',
        handler: () => this.execShortcut(this.toggleGameMode),
      },
    ]);
    // TODO: add map change shortcut
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

        catchPromise(
          this.showDialog({
            key: 'strats-view/confirm-tutorial',
            text: `Hey there! Looks like you just created your first strat.<br>You can now edit the content of the strat by clicking the blinking box.<br>
              You can mention teammates with "<b>@</b>".<br>You can link utility from the nadebook with "<b>#</b>"<br>You can
              link weapons or equipment with "<b>/</b>".`,
            resolveBtn: 'OK',
            confirmOnly: true,
            htmlMode: true,
          }),
          () => {
            const formData = new FormData();
            formData.append('completedTutorial', 'true');
            this.updateProfile(formData);
          }
        );
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

  private toggleStratActive(data: Partial<Strat>) {
    this.updateStrat(data);
  }

  private requestDeleteStrat(stratID: string) {
    catchPromise(
      this.showDialog({
        key: 'strats-view/confirm-delete',
        text: 'Are you sure you want to delete this strat?',
      }),
      () => this.deleteStrat(stratID)
    );
  }

  private requestShareStrat(stratID: string) {
    catchPromise(
      this.showDialog({
        key: 'strats-view/confirm-share',
        text: 'Do you want to create a share-link to let other teams add this strat to their stratbook?',
      }),
      () => this.shareStrat(stratID)
    );
  }

  private updateContent(payload: Partial<Strat>) {
    this.updateStrat(payload);
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
    this.trackingService.track('Click: Show DrawTool', { strat: strat.name });
  }

  private toggleFilterMenu() {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  private toggleGameMode() {
    this.gameMode ? this.exitGameMode() : this.startGameMode();
    this.trackingService.track('Action: Toggle GameMode', { value: this.gameMode });
  }

  private async toggleSort() {
    await this.updateSort(this.sort === Sort.DateAddedASC ? Sort.DateAddedDESC : Sort.DateAddedASC);
    // TODO: find better way
    this.stratList.$forceUpdate();
    this.trackingService.track('Action: Change Sort Direction', {
      direction: this.sort === Sort.DateAddedASC ? 'Date Added ASC' : 'Date Added DESC',
    });
  }
}
