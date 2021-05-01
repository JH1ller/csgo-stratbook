import { Component, Prop, Vue, Emit, Ref, Watch } from 'vue-property-decorator';
import StratEditor from '@/components/StratEditor/StratEditor.vue';
import TypeBadge from '@/components/TypeBadge/TypeBadge.vue';
import SideBadge from '@/components/SideBadge/SideBadge.vue';
import { appModule, filterModule } from '@/store/namespaces';
import { Strat } from '@/api/models/Strat';
import { Sides } from '@/api/models/Sides';
import { StratFilters } from '@/store/modules/filter';
import { openLink } from '@/utils/openLink';
import { StratTypes } from '@/api/models/StratTypes';

@Component({
  components: {
    StratEditor,
    TypeBadge,
    SideBadge,
  },
})
export default class StratItem extends Vue {
  @appModule.State gameMode!: boolean;

  @Prop() private strat!: Strat;
  @Prop() private completedTutorial!: boolean;
  @Prop() private isTutorial!: boolean;
  @Prop() private collapsed!: boolean;
  @Ref() editor!: any;
  @filterModule.State filters!: StratFilters;

  //* defer initial collapsed state to get max item height first
  private deferredCollapsed = false;

  private componentEl!: HTMLElement;
  private componentHeight!: number;

  private editMode = false;
  private editorKey = 0;

  private mounted() {
    this.componentEl = this.$el as HTMLElement;
    this.componentHeight = this.componentEl.clientHeight;
    this.deferredCollapsed = this.collapsed;
    this.setComponentHeight();
  }

  private transitionEndHandler() {
    if (!this.deferredCollapsed) {
      this.componentEl.style.height = '';
    }
  }

  // TODO: handle window resize
  @Watch('collapsed')
  private async collapsedChanged(to: boolean) {
    if (to) {
      this.componentHeight = this.componentEl.clientHeight;
      this.setComponentHeight();
      await this.$nextTick();
    }
    this.deferredCollapsed = to;
    this.setComponentHeight();
  }

  private setComponentHeight() {
    this.componentEl.style.height = this.deferredCollapsed ? '59px' : `${this.componentHeight + 5}px`;
  }

  private get isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private openVideo() {
    openLink(this.strat.videoLink as string);
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

  private editorUpdated(content: string) {
    if (content !== this.strat.content) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
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
  private updateContent(): Partial<Strat> {
    this.editMode = false;
    return { _id: this.strat._id, content: this.editor.textarea.innerHTML };
  }

  private discardContent(): void {
    this.editMode = false;
    // * force refresh of editor
    this.editorKey++;
  }

  private insertPlayerRows(): void {
    // TODO: find better way to structure this, instead of calling method on child component directly
    this.editor.insertPlayerRows();
  }

  // TODO: replace with i18n implementation once vuei18n is in
  private get typeTooltip() {
    switch (this.strat.type) {
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
