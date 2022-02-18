import { Component, Mixins, Prop, Ref } from 'vue-property-decorator';
import CloseOnEscape from '@/mixins/CloseOnEscape';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import { mapModule } from '@/store/namespaces';
import { MapID } from '../MapPicker/MapPicker';
import { Stage, StageConfig } from 'konva/lib/Stage';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { nanoid } from 'nanoid';
import { Image as KonvaImage, ImageConfig } from 'konva/lib/shapes/Image';
import { Line, LineConfig } from 'konva/lib/shapes/Line';
import { Text } from 'konva/lib/shapes/Text';
import { Rect } from 'konva/lib/shapes/Rect';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { KonvaEventObject, Node as KonvaNode } from 'konva/lib/Node';
import { Util } from 'konva/lib/Util';
import { DebouncedFunc, throttle, cloneDeep } from 'lodash-es';
import { downloadURI } from '@/utils/downloadUri';
import ShortcutService from '@/services/shortcut.service';
import { Listen } from '@/utils/decorators/listen.decorator';
import { optimizeLine } from './utils';
import VSwatches from 'vue-swatches';
import { Strat } from '@/api/models/Strat';

type KonvaRef<T> = Vue & { getNode: () => T; getStage: () => Stage };

interface ImageItem {
  id: string;
  x: number;
  y: number;
  type: UtilityTypes;
}

interface LineItem {
  id: string;
  stroke: string;
  points: number[];
  color: string;
}

enum ToolTypes {
  Brush = 'BRUSH',
  Pan = 'PAN',
  Pointer = 'POINTER',
  Text = 'TEXT',
}

interface StageState {
  items: ImageItem[];
  lines: LineItem[];
}

@Component({
  components: {
    BackdropDialog,
    VSwatches,
  },
})
export default class SketchTool extends Mixins(CloseOnEscape) {
  @mapModule.State currentMap!: MapID;
  @Ref() stageRef!: KonvaRef<Stage>;
  @Ref() stageContainer!: HTMLDivElement;
  @Ref() transformer!: KonvaRef<Transformer>;
  @Ref() selectionRect!: KonvaRef<Rect>;
  @Prop() strat!: Strat;
  backgroundImage = new Image();
  utilImages!: Record<UtilityTypes, HTMLImageElement>;
  imageItems: ImageItem[] = [];
  lines: LineItem[] = [];
  activeItem: KonvaNode | null = null;
  // to save previous tool when switching active tool to PAN
  previousTool!: ToolTypes | null;
  activeTool: ToolTypes = ToolTypes.Brush;
  isDrawing = false;
  currentLine!: Line | null;
  readonly linePrecision = 10;
  readonly imageSize = 50;
  UtilityTypes: typeof UtilityTypes = UtilityTypes;
  ToolTypes: typeof ToolTypes = ToolTypes;
  shortcutService = ShortcutService.getInstance();
  changeHistory: StageState[] = [];
  historyPointer = -1;
  readonly backgroundSize = 800;
  currentColor = '#1fbc9c';

  undo(): void {
    if (this.historyPointer > 0) {
      this.historyPointer--;
      const historySnapshot = this.changeHistory[this.historyPointer];
      if (!historySnapshot) return;
      this.imageItems = historySnapshot.items;
      this.lines = historySnapshot.lines;
    }
  }

  redo(): void {
    if (this.historyPointer < this.changeHistory.length - 1) {
      this.historyPointer++;
      const { items, lines } = this.changeHistory[this.historyPointer];
      this.imageItems = items;
      this.lines = lines;
    }
  }

  getStageConfig(): Partial<StageConfig> {
    return {
      draggable: this.activeTool === ToolTypes.Pan,
    };
  }

  getImageItemConfig(item: ImageItem): ImageConfig {
    return {
      id: item.id,
      x: item.x,
      y: item.y,
      width: this.imageSize,
      height: this.imageSize,
      strokeWidth: 1,
      draggable: this.activeTool === ToolTypes.Pointer,
      image: this.utilImages[item.type],
    };
  }

  getLineItemConfig(item: LineItem): LineConfig {
    return {
      id: item.id,
      stroke: item.color,
      strokeWidth: 6,
      draggable: this.activeTool === ToolTypes.Pointer,
      lineCap: 'round',
      points: item.points,
      tension: 0.4,
      opacity: 0.8,
      shadowColor: 'black',
      shadowBlur: 16,
      shadowOpacity: 0.5,
      shadowForStrokeEnabled: true,
      shadowOffset: { x: 2, y: 2 },
    };
  }

  backgroundConfig = {
    id: 'background-image',
    x: 0,
    y: 0,
    image: this.backgroundImage,
    width: this.backgroundSize,
    height: this.backgroundSize,
  };

  selectionRectState = {
    x1: -1,
    x2: -1,
    y1: -1,
    y2: -1,
  };

  selectionRectConfig = {
    fill: 'rgba(0,0,255,0.5)',
    width: 0,
    height: 0,
    x: -1,
    y: -1,
    visible: false,
  };

  getAllNodes(): KonvaNode[] {
    return this.stage.getLayers()[1].children ?? [];
  }

  createUtilImage(util: UtilityTypes): HTMLImageElement {
    const img = new Image();
    try {
      img.src = require(`@/assets/images/drawtool/${util.toLowerCase()}.png`);
    } catch (error) {
      console.log(error);
    }
    return img;
  }

  getScaledPointerPosition(): { x: number; y: number } {
    const { x, y } = this.stage.getPointerPosition()!;
    return {
      x: (x - this.stage.x()) / this.stage.scaleX(),
      y: (y - this.stage.y()) / this.stage.scaleY(),
    };
  }

  @Listen('resize', { window: true })
  resizeHandler() {
    this.setResponsiveStageSize();
  }

  get setResponsiveStageSize(): DebouncedFunc<(noAnim?: boolean) => void> {
    return throttle((noAnim: boolean = false) => {
      const containerWidth = this.stageContainer.clientWidth;
      const containerHeight = this.stageContainer.clientHeight;

      this.stage.size({
        width: containerWidth,
        height: containerHeight,
      });

      let targetScale = 1;
      if (containerHeight < this.backgroundSize) {
        targetScale = containerHeight / this.backgroundSize;
        // limit to scale of 0.5
        targetScale = targetScale < 0.5 ? 0.5 : targetScale;
      }
      if (containerWidth < this.backgroundSize) {
        targetScale = containerWidth / this.backgroundSize;
        // limit to scale of 0.5
        targetScale = targetScale < 0.5 ? 0.5 : targetScale;
      }

      const targetAttrs = {
        x: containerWidth / 2 - (this.backgroundSize * targetScale) / 2,
        y: containerHeight / 2 - (this.backgroundSize * targetScale) / 2,
        scaleY: targetScale,
        scaleX: targetScale,
      };

      if (noAnim) {
        this.stage.setAttrs(targetAttrs);
      } else {
        this.stage.to({
          ...targetAttrs,
          duration: 0.2,
        });
      }
    }, 200);
  }

  handleDragStart(event: DragEvent, type: UtilityTypes) {
    if (!event.dataTransfer) return;

    event.dataTransfer.setData('text/plain', type);

    // create wrapper for image element, because otherwise we can't style it.
    const wrapper = document.createElement('div');
    const image = document.createElement('img');
    image.src = require(`@/assets/icons/${type.toLowerCase()}.png`);
    wrapper.id = 'drag-ghost';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '-1000px';
    image.style.filter = 'invert(1)';
    image.style.width = '42px';
    image.style.height = '42px';
    wrapper.appendChild(image);
    document.body.appendChild(wrapper);

    event.dataTransfer.setDragImage(wrapper, 24, 24);
    event.dataTransfer.dropEffect = 'copy';
  }

  handleDragOver(event: DragEvent) {
    if (!event.dataTransfer) return;
    event.preventDefault();

    event.dataTransfer.dropEffect = 'copy';
  }

  handleDragEnd() {
    // Drag was finished or cancelled, remove ghost element that follows cursor
    const dragGhost = document.querySelector('#drag-ghost');
    if (dragGhost?.parentNode) {
      dragGhost.parentNode.removeChild(dragGhost);
    }
  }

  async handleDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    event.preventDefault();

    const type = event.dataTransfer.getData('text/plain');
    this.stage.setPointersPositions(event);

    const pos = this.getScaledPointerPosition();
    const newId = nanoid(10);

    this.imageItems.push({
      id: newId,
      x: pos!.x - this.imageSize / 2,
      y: pos!.y - this.imageSize / 2,
      type: type as UtilityTypes,
    });
    this.activeTool = ToolTypes.Pointer;
    await this.$nextTick();
    this.setActiveItem(this.stage.findOne('#' + newId));
  }

  created() {
    this.backgroundImage.src = `minimaps/${this.currentMap.toLowerCase()}.jpg`;

    // cache available utility icons
    this.utilImages = Object.values(UtilityTypes).reduce<any>((acc, type) => {
      acc[type] = this.createUtilImage(type);
      return acc;
    }, {});

    // setup shortcuts & key events
    this.shortcutService.add([
      {
        shortcut: 'del',
        handler: () => this.removeActiveItem(),
      },
      {
        shortcut: 'ctrl+z',
        handler: () => this.undo(),
      },
      {
        shortcut: 'ctrl+y',
        handler: () => this.redo(),
      },
    ]);
  }

  clearStage(): void {
    this.imageItems = [];
    this.lines = [];
    this.serialize();
  }

  beforeDestroy() {
    this.shortcutService.reset();
  }

  @Listen('keyup')
  keyupHandler({ code, type }: KeyboardEvent) {
    switch (code) {
      case 'Space':
        console.log('keyup', code);
        this.activeTool = this.previousTool ?? ToolTypes.Pan;
        this.previousTool = null;
    }
  }

  @Listen('keydown')
  keydownHandler({ code }: KeyboardEvent) {
    switch (code) {
      case 'Space':
        if (this.activeTool === ToolTypes.Pan) return;
        this.previousTool = this.activeTool;
        this.activeTool = ToolTypes.Pan;
        break;
      case 'KeyV':
        this.activeTool = ToolTypes.Pointer;
        break;
      case 'KeyB':
        this.activeTool = ToolTypes.Brush;
        break;
    }
  }

  removeActiveItem(): void {
    if (!this.activeItem) return;
    this.lines = this.lines.filter(line => line.id !== this.activeItem?.attrs.id);
    this.imageItems = this.imageItems.filter(item => item.id !== this.activeItem?.attrs.id);
    this.setActiveItem(null);
    this.serialize();
  }

  get stage(): Stage {
    return this.stageRef.getStage();
  }

  async handleMouseDown({ target }: KonvaEventObject<MouseEvent>) {
    const pos = this.getScaledPointerPosition();
    switch (this.activeTool) {
      case ToolTypes.Brush:
        const id = nanoid(10);
        this.lines.push({
          id,
          stroke: 'white',
          points: [pos.x, pos.y, pos.x, pos.y],
          color: this.currentColor,
        });
        await this.$nextTick();
        this.currentLine = this.stage.findOne<Line>('#' + id);
        this.isDrawing = true;
        break;
      case ToolTypes.Pointer:
        console.log(target);
        if (target instanceof KonvaImage && target.attrs.id !== 'background-image') {
          this.setActiveItem(target);
          return;
        }
        if (target instanceof Line) {
          this.setActiveItem(target);
          return;
        }
        if (!(target.parent instanceof Transformer)) {
          // remove activeItem when clicking outside of a node.
          this.setActiveItem(null);
        }
        if ((target instanceof KonvaImage && target.attrs.id === 'background-image') || target instanceof Stage) {
          this.selectionRectState.x1 = pos.x;
          this.selectionRectState.x2 = pos.x;
          this.selectionRectState.y1 = pos.y;
          this.selectionRectState.y2 = pos.y;
          this.selectionRectConfig.visible = true;
          return;
        }
    }
  }

  setActiveItem(item: KonvaNode | null): void {
    this.activeItem = item;

    if (
      item &&
      this.transformer
        .getNode()
        .nodes()
        .includes(item)
    ) {
      return;
    }
    this.transformer.getNode().nodes(this.activeItem ? [this.activeItem] : []);
  }

  handleMouseMove({ evt }: KonvaEventObject<MouseEvent>) {
    switch (this.activeTool) {
      case ToolTypes.Brush:
        this.draw(evt);
        break;
      case ToolTypes.Pointer:
        if (this.selectionRectConfig.visible) {
          const pos = this.getScaledPointerPosition();
          this.selectionRectState.x2 = pos.x;
          this.selectionRectState.y2 = pos.y;
          const { x1, x2, y1, y2 } = this.selectionRectState;
          this.selectionRectConfig.x = Math.min(x1, x2);
          this.selectionRectConfig.y = Math.min(y1, y2);
          this.selectionRectConfig.width = Math.abs(x2 - x1);
          this.selectionRectConfig.height = Math.abs(y2 - y1);
          const box = this.selectionRect.getNode().getClientRect();
          const selectedNodes = this.getAllNodes().filter(node => Util.haveIntersection(box, node.getClientRect()));
          this.transformer.getNode().nodes(selectedNodes);
        }
    }
  }

  // draw line on mousemove
  draw(evt: MouseEvent) {
    evt.preventDefault();

    if (!this.isDrawing || !this.currentLine) return;

    const pos = this.getScaledPointerPosition();

    const points = this.currentLine.points();
    const prevX = points[points.length - 4];
    const prevY = points[points.length - 3];

    // only add point if distance to previous point is over 20
    if (Math.hypot(pos.x - prevX, pos.y - prevY) > this.linePrecision) {
      points.push(pos.x, pos.y);
      this.serialize();
    }
    points[points.length - 2] = pos.x;
    points[points.length - 1] = pos.y;

    this.currentLine.points(points);
  }

  handleMouseUp() {
    console.log('handleMouseUp');
    switch (this.activeTool) {
      case ToolTypes.Brush:
        if (this.isDrawing) {
          this.isDrawing = false;

          optimizeLine(this.currentLine!);
          this.saveStateToHistory();
          this.serialize();

          this.currentLine = null;
        }
        break;
      case ToolTypes.Pointer:
        if (this.selectionRectConfig.visible) {
          this.selectionRectConfig.visible = false;
          this.selectionRectConfig.width = 0;
          this.selectionRectConfig.height = 0;
          this.selectionRectConfig.x = -1;
          this.selectionRectConfig.y = -1;
          this.selectionRectState.x1 = -1;
          this.selectionRectState.x2 = -1;
          this.selectionRectState.y1 = -1;
          this.selectionRectState.y2 = -1;
        }
    }
  }

  handleMoveStart({ target, evt }: KonvaEventObject<DragEvent>): void {
    if (target instanceof KonvaImage) {
      this.activeItem = target;
      return;
    }

    if (target instanceof Stage) {
      evt.preventDefault();
      return;
    }
  }

  handleMoveTick({ target }: KonvaEventObject<DragEvent>) {
    if (target instanceof KonvaImage) {
      const { id, x, y, width, height } = target.attrs;
      const targetX = x < 0 ? 0 : x + width <= this.backgroundSize ? x : this.backgroundSize - width;
      const targetY = y < 0 ? 0 : y + height <= this.backgroundSize ? y : this.backgroundSize - height;
      target.position({ x: targetX, y: targetY });
      this.updateItem(id, { x: targetX, y: targetY });
      this.serialize();
      return;
    }
  }

  handleZoom({ evt }: KonvaEventObject<WheelEvent>) {
    evt.preventDefault();

    const scaleBy = 1.1;
    const oldScale = this.stage.scaleX();

    // how to scale? Zoom in? Or zoom out?
    let direction = evt.deltaY < 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale < 0.5 || newScale > 2.5) return;

    const pos = this.stage.getPointerPosition()!;

    const mousePointTo = {
      x: (pos.x - this.stage.x()) / oldScale,
      y: (pos.y - this.stage.y()) / oldScale,
    };

    const newPos = {
      x: pos.x - mousePointTo.x * newScale,
      y: pos.y - mousePointTo.y * newScale,
    };

    this.stage.position(newPos);
    this.stage.scale({ x: newScale, y: newScale });
  }

  get updateItem() {
    return throttle((id: string, attributes: Partial<ImageItem>) => {
      const target = this.imageItems.find(item => item.id === id);
      if (!target) {
        console.warn(`Stage item with id: ${id} not found`);
        return;
      }
      Object.assign(target, attributes);
    }, 20);
  }

  updateLine(id: string, attributes: Partial<LineItem>): void {
    const target = this.lines.find(item => item.id === id);
    if (!target) {
      console.warn(`Line item with id: ${id} not found`);
      return;
    }
    Object.assign(target, attributes);
  }

  handleMoveEnd(e: Event): void {
    this.serialize();
  }

  get serialize(): DebouncedFunc<() => void> {
    return throttle(() => {
      const json = JSON.stringify({ items: this.imageItems, lines: this.lines });
      localStorage.setItem('konva', json);
    }, 200);
  }

  // TODO: this is a bit buggy when undoing a change, then creating a new one
  // and then undoing again
  saveStateToHistory(): void {
    if (this.historyPointer < this.changeHistory.length - 1) {
      this.changeHistory.splice(this.historyPointer + 1);
    }
    this.changeHistory.push({
      items: cloneDeep(this.imageItems),
      lines: cloneDeep(this.lines),
    });
    this.historyPointer++;
  }

  loadJson(): void {
    const json = localStorage.getItem('konva');
    if (json) {
      const { items, lines } = JSON.parse(json);
      this.imageItems = items;
      this.lines = lines;
    }
  }

  saveToFile() {
    this.setResponsiveStageSize(true);
    const tempTextNode = new Text({
      x: 16,
      y: 16,
      text: this.strat.name,
      fontSize: 32,
      fontFamily: 'Ubuntu-Bold',
      fill: 'white',
      shadowColor: 'black',
      shadowBlur: 8,
      shadowOpacity: 0.8,
      shadowOffset: { x: 2, y: 2 },
    });

    this.stage.getLayers()[this.stage.getLayers().length - 1].add(tempTextNode);

    const dataUri = this.stage.toDataURL({
      pixelRatio: 1.5,
      x: this.stage.x(),
      y: this.stage.y(),
      width: this.backgroundSize,
      height: this.backgroundSize,
    });

    tempTextNode.remove();

    downloadURI(dataUri, this.strat.name.replaceAll(/[^a-zA-Z ]/g, '').replaceAll(' ', '_') + '.png');
  }

  mounted() {
    this.setResponsiveStageSize();
    (window as any).konva = this.stage;

    this.imageItems.push({
      id: nanoid(),
      x: 100,
      y: 100,
      type: UtilityTypes.GRENADE,
    });
    this.imageItems.push({
      id: nanoid(),
      x: 200,
      y: 200,
      type: UtilityTypes.MOLOTOV,
    });

    this.saveStateToHistory();

    console.log(this.stage.findOne('#background-image'));

    (window as any).loadjson = this.loadJson;
    (window as any).saveToFile = this.saveToFile;
    (window as any).stage = this.stage;
  }
}
