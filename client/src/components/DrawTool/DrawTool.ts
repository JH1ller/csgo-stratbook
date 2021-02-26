import { Component, Emit, Mixins, Prop, Ref, Watch } from 'vue-property-decorator';
import ImageEditor from 'vue-image-markup';
import { mapModule } from '@/store/namespaces';
import { MapID } from '../MapPicker/MapPicker';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import CloseOnEscape from '@/mixins/CloseOnEscape';
import { Strat } from '@/api/models/Strat';
import VSwatches from 'vue-swatches';
import SmartImage from '@/components/SmartImage/SmartImage.vue';

@Component({
  components: {
    ImageEditor,
    BackdropDialog,
    VSwatches,
    SmartImage,
  },
})
export default class DrawTool extends Mixins(CloseOnEscape) {
  @mapModule.State private currentMap!: MapID;
  @Ref() private editor!: any;
  @Ref() private wrapper!: any;
  @Prop() private strat!: Strat;
  private canvas!: any;
  private activeTool = 'freeDrawing';

  private canvasWidth = 512;
  private canvasHeight = 512;
  private currentColor = '#1fbc9c';

  private backgroundLoaded = false;

  private get mapURL() {
    return `minimaps/${this.currentMap.toLowerCase()}.jpg`;
  }

  private mounted() {
    this.canvas = this.editor.canvas;

    this.canvas.backgroundColor = null;

    if (this.strat.drawData) {
      this.loadData(this.strat.drawData);
    }

    this.canvas.on('path:created', () => this.save());
    this.canvas.on('created', () => this.save());
    this.canvas.on('text:changed', () => this.save());
    this.canvas.on('object:modified', () => this.save());
    this.canvas.on('object:removed', () => this.save());

    this.setTool('freeDrawing');

    this.setupEventlisteners();
    this.setCanvasDynamicWidth();
  }

  private setCanvasDynamicWidth() {
    const dynamicWidth = this.wrapper.getBoundingClientRect().width + 'px';

    const canvasContainer = document.querySelector('.canvas-container') as HTMLDivElement;
    const lowerCanvas = document.querySelector('.lower-canvas') as HTMLCanvasElement;
    const upperCanvas = document.querySelector('.upper-canvas') as HTMLCanvasElement;

    canvasContainer.style.width = dynamicWidth;
    canvasContainer.style.height = dynamicWidth;
    lowerCanvas.style.width = dynamicWidth;
    lowerCanvas.style.height = dynamicWidth;
    upperCanvas.style.width = dynamicWidth;
    upperCanvas.style.height = dynamicWidth;
  }

  private beforeUnmount() {
    this.removeEventListeners();
  }

  private loadData(newData: string) {
    const oldData = JSON.stringify(this.editor.serialize());
    if (newData !== oldData) {
      this.canvas.loadFromJSON(newData);
    }
  }

  private imgLoadedHandler() {
    this.backgroundLoaded = true;
  }

  private setupEventlisteners() {
    document.addEventListener('keypress', e => this.keypressHandler(e));
    document.addEventListener('keydown', e => this.keydownHandler(e));
  }

  private removeEventListeners() {
    document.removeEventListener('keypress', e => this.keypressHandler(e));
    document.removeEventListener('keydown', e => this.keydownHandler(e));
  }

  private keypressHandler(e: KeyboardEvent) {
    if (e.code === 'KeyY' && e.ctrlKey) {
      if (e.shiftKey) {
        this.editor.redo();
        this.save();
      } else {
        this.editor.undo();
        this.save();
      }
    }
  }

  private keydownHandler({ key }: KeyboardEvent) {
    if (key === 'Delete') {
      this.canvas.remove(this.canvas.getActiveObject());
    }
  }

  private clear() {
    this.editor.clear();
    this.save();
  }

  private setTool(tool: string, params?: any) {
    this.activeTool = tool;
    this.editor.set(tool, params);
  }

  @Watch('strat.drawData')
  private drawDataChanged(to: string, from: string) {
    if (to !== from) {
      this.loadData(to);
    }
  }

  @Emit()
  private save() {
    return {
      _id: this.strat._id,
      drawData: JSON.stringify(this.editor.serialize()),
    };
  }
}
