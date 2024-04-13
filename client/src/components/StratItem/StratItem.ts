import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import StratEditor from '@/components/StratEditor/StratEditor.vue';
import IStratEditor from '@/components/StratEditor/StratEditor';
import TypeBadge from '@/components/TypeBadge/TypeBadge.vue';
import SideBadge from '@/components/SideBadge/SideBadge.vue';
import LabelsDialog from '@/components/LabelsDialog/LabelsDialog.vue';
import { appModule, stratModule } from '@/store/namespaces';
import { Strat } from '@/api/models/Strat';
import { Sides } from '@/api/models/Sides';
import { openLink } from '@/utils/openLink';
import { StratTypes } from '@/api/models/StratTypes';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import { titleCase } from '@/utils/titleCase';
import { HandleDirective } from 'vue-slicksort';
import { Sort } from '@/utils/sortFunctions';

@Component({
  components: {
    StratEditor,
    TypeBadge,
    SideBadge,
    LabelsDialog,
  },
  directives: { handle: HandleDirective },
})
export default class StratItem extends Vue {
  @Prop() readOnly!: boolean;
  @Prop() strat!: Strat;
  @Prop() completedTutorial!: boolean;
  @Prop() isTutorial!: boolean;
  @Prop() collapsed!: boolean;
  @Prop() editMode!: boolean;
  @Ref() editor!: IStratEditor;
  @Ref() labelAddInput!: HTMLInputElement;
  @appModule.Action showToast!: (toast: Toast) => Promise<void>;
  @stratModule.State sort!: Sort;

  labelDialogOpen = false;

  editorKey = 0;

  get isManualSort() {
    return this.sort === Sort.Manual;
  }

  get hasDrawData(): boolean {
    return (
      !!this.strat.drawData && Object.values(this.strat.drawData).some((value) => Array.isArray(value) && value.length)
    );
  }

  get isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  get sortedTypes(): StratTypes[] {
    return this.strat.types.sort((a, b) => a.localeCompare(b, 'en'));
  }

  openVideo() {
    openLink(this.strat.videoLink as string);
  }

  async handleLabelAddClicked() {
    this.labelDialogOpen = true;
    await this.$nextTick();
    this.labelAddInput.focus();
  }

  handleLabelSubmit(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      if (value) {
        this.addLabel(value);
        this.labelDialogOpen = false;
      }
    }

    if (e.key === 'Escape') {
      this.labelDialogOpen = false;
    }
  }

  @Emit()
  filterType(type: StratTypes) {
    this.showToast({ id: 'strat-item/filter-type', text: `Applied filter: ${titleCase(type)}` });
    return type;
  }

  @Emit()
  filterSide() {
    this.showToast({ id: 'strat-item/filter-side', text: `Applied filter: ${this.strat.side} side` });
    return this.strat.side;
  }

  @Emit()
  deleteStrat() {
    return this.strat._id;
  }

  @Emit()
  editStrat() {
    return this.strat;
  }

  @Emit()
  shareStrat() {
    return this.strat._id;
  }

  @Emit()
  unshareStrat() {
    return this.strat._id;
  }

  @Emit()
  toggleCollapse() {
    return this.strat._id;
  }

  @Emit()
  editChanged(value: boolean) {
    return { stratID: this.strat._id, value };
  }

  @Emit()
  toggleActive(): Partial<Strat> {
    return { _id: this.strat._id, active: !this.strat.active };
  }

  @Emit()
  showMap() {
    return;
  }

  @Emit()
  editorFocussed() {
    return;
  }

  @Emit()
  editorBlurred() {
    return;
  }

  @Emit()
  addLabel(value: string) {
    return { _id: this.strat._id, labels: [...this.strat.labels, value] };
  }

  @Emit()
  updateContent(): Partial<Strat> {
    this.editChanged(false);
    return { _id: this.strat._id, content: this.editor.textarea.innerHTML };
  }

  editorUpdated(content: string) {
    const editMode = content !== this.strat.content;
    if (editMode !== this.editMode) {
      this.editChanged(editMode);
    }
  }

  discardContent(): void {
    this.editChanged(false);
    // * force refresh of editor
    this.editorKey++;
  }

  insertPlayerRows(): void {
    // TODO: find better way to structure this, instead of calling method on child component directly
    this.editor.insertPlayerRows();
  }

  // TODO: replace with i18n implementation once vuei18n is in
  typeTooltip(type: StratTypes): string {
    switch (type) {
      case StratTypes.BUYROUND:
        return 'Buy-Round';
      case StratTypes.FORCE:
        return 'Force-Buy';
      case StratTypes.PISTOL:
        return 'Pistol-Round';
    }
  }

  // TODO: replace with i18n implementation once vuei18n is in
  get sideTooltip() {
    switch (this.strat.side) {
      case Sides.CT:
        return 'CT Side';
      case Sides.T:
        return 'T Side';
    }
  }
}
