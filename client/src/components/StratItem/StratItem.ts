import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import StratEditor from '@/components/StratEditor/StratEditor.vue';
import TypeBadge from '@/components/TypeBadge/TypeBadge.vue';
import SideBadge from '@/components/SideBadge/SideBadge.vue';
import { filterModule } from '@/store/namespaces';
import { Strat } from '@/api/models/Strat';
import { Sides } from '@/api/models/Sides';
import { StratTypes } from '@/api/models/StratTypes';

@Component({
  components: {
    StratEditor,
    TypeBadge,
    SideBadge,
  },
})
export default class StratItem extends Vue {
  @Prop() private strat!: Strat;
  @Ref() editor!: any;
  @filterModule.State filters!: {
    // TODO: create interface for Filter
    name: string;
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };
  private editMode: boolean = false;
  private editorKey: string = Math.random()
    .toString(36)
    .substring(2);

  private get isCtSide(): boolean {
    return this.strat.side === Sides.CT;
  }

  private openVideo() {
    if (process?.versions?.electron) {
      const { shell } = require('electron').remote;
      shell.openExternal(this.strat.videoLink as string);
    } else {
      window.open(this.strat.videoLink, '_blank');
    }
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
  private updateContent(): Partial<Strat> {
    this.editMode = false;
    return { _id: this.strat._id, content: this.editor.textarea.innerHTML };
  }

  private discardContent(): void {
    this.editMode = false;
    // * force refresh of editor
    this.editorKey = Math.random()
      .toString(36)
      .substring(2);
  }
}