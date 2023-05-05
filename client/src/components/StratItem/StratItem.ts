import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import StratEditor from '@/components/StratEditor/StratEditor.vue';
import IStratEditor from '@/components/StratEditor/StratEditor';
import TypeBadge from '@/components/TypeBadge/TypeBadge.vue';
import SideBadge from '@/components/SideBadge/SideBadge.vue';
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
  },
  directives: { handle: HandleDirective },
})
export default class StratItem extends Vue {
  @Prop() private gameMode!: boolean;
  @Prop() private strat!: Strat;
  @Prop() private completedTutorial!: boolean;
  @Prop() private isTutorial!: boolean;
  @Prop() private collapsed!: boolean;
  @Prop() private editMode!: boolean;
  @Ref() private editor!: IStratEditor;
  @appModule.Action private showToast!: (toast: Toast) => Promise<void>;
  @stratModule.State private sort!: Sort;

  private editorKey = 0;

  private get isManualSort() {
    return this.sort === Sort.Manual;
  }

  get hasDrawData(): boolean {
    return (
      !!this.strat.drawData && Object.values(this.strat.drawData).some((value) => Array.isArray(value) && value.length)
    );
  }

  private get isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private get sortedTypes(): StratTypes[] {
    return this.strat.types.sort((a, b) => a.localeCompare(b, 'en'));
  }

  private openVideo() {
    openLink(this.strat.videoLink as string);
  }

  @Emit()
  private filterType(type: StratTypes) {
    this.showToast({ id: 'strat-item/filter-type', text: `Applied filter: ${titleCase(type)}` });
    return type;
  }

  @Emit()
  private filterSide() {
    this.showToast({ id: 'strat-item/filter-side', text: `Applied filter: ${this.strat.side} side` });
    return this.strat.side;
  }

  @Emit()
  private deleteStrat() {
    return this.strat._id;
  }

  @Emit()
  private editStrat() {
    return this.strat;
  }

  @Emit()
  private shareStrat() {
    return this.strat._id;
  }

  @Emit()
  private unshareStrat() {
    return this.strat._id;
  }

  @Emit()
  private toggleCollapse() {
    return this.strat._id;
  }

  @Emit()
  private editChanged(value: boolean) {
    return { stratID: this.strat._id, value };
  }

  @Emit()
  private toggleActive(): Partial<Strat> {
    return { _id: this.strat._id, active: !this.strat.active };
  }

  @Emit()
  private showMap() {
    return;
  }

  @Emit()
  private editorFocussed() {
    return;
  }

  @Emit()
  private editorBlurred() {
    return;
  }

  @Emit()
  private updateContent(): Partial<Strat> {
    this.editChanged(false);
    return { _id: this.strat._id, content: this.editor.textarea.innerHTML };
  }

  private editorUpdated(content: string) {
    const editMode = content !== this.strat.content;
    if (editMode !== this.editMode) {
      this.editChanged(editMode);
    }
  }

  private discardContent(): void {
    this.editChanged(false);
    // * force refresh of editor
    this.editorKey++;
  }

  private insertPlayerRows(): void {
    // TODO: find better way to structure this, instead of calling method on child component directly
    this.editor.insertPlayerRows();
  }

  // TODO: replace with i18n implementation once vuei18n is in
  private typeTooltip(type: StratTypes): string {
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
  private get sideTooltip() {
    switch (this.strat.side) {
      case Sides.CT:
        return 'CT Side';
      case Sides.T:
        return 'T Side';
    }
  }
}
