import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import StratEditor from '@/components/StratEditor/StratEditor.vue';
import TypeBadge from '@/components/TypeBadge/TypeBadge.vue';
import SideBadge from '@/components/SideBadge/SideBadge.vue';
import { filterModule } from '@/store/namespaces';
import { Strat } from '@/api/models/Strat';
import { Sides } from '@/api/models/Sides';
import { StratFilters } from '@/store/modules/filter';
import { isDesktop } from '@/utils/isDesktop';
import { openLink } from '@/utils/openLink';

@Component({
  components: {
    StratEditor,
    TypeBadge,
    SideBadge,
  },
})
export default class StratItem extends Vue {
  @Prop() private strat!: Strat;
  @Prop() private completedTutorial!: boolean;
  @Prop() private isTutorial!: boolean;
  @Ref() editor!: any;
  @filterModule.State filters!: StratFilters;

  private editMode = false;
  private editorKey = 0;

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
}
