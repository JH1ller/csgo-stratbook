import { Vue, Component, Mixins, Prop, Ref, Inject, Emit, Watch } from 'vue-property-decorator';
import CloseOnEscape from '@/mixins/CloseOnEscape';
import { appModule } from '@/store/namespaces';
import { MapID } from '../MapPicker/MapPicker';
import { Stage, StageConfig } from 'konva/lib/Stage';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { nanoid } from 'nanoid';
import { Image as KonvaImage, ImageConfig } from 'konva/lib/shapes/Image';
import { Line, LineConfig } from 'konva/lib/shapes/Line';
import { Text, TextConfig } from 'konva/lib/shapes/Text';
import { Rect, RectConfig } from 'konva/lib/shapes/Rect';
import { Transformer, TransformerConfig } from 'konva/lib/shapes/Transformer';
import { KonvaEventObject, Node as KonvaNode } from 'konva/lib/Node';
import { Util } from 'konva/lib/Util';
import { DebouncedFunc, throttle, cloneDeep } from 'lodash-es';
import { downloadURI } from '@/utils/downloadUri';
import ShortcutService from '@/services/shortcut.service';
import { Listen } from '@/utils/decorators/listen.decorator';
import {
  clamp,
  createPointerImage,
  createUtilImage,
  fadeIn,
  fadeOut,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  optimizeLine,
  rotateVector,
} from './utils';
import VSwatches from 'vue-swatches';
import { Strat } from '@/api/models/Strat';
import { timeout } from '@/utils/timeout';
import { Vector2d } from 'konva/lib/types';
import { Log } from '@/utils/logger';
import SocketConnection from './utils/SocketConnection';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import { KonvaRef, ImageItem, LineItem, TextItem, ToolTypes, StageState, RemotePointer } from './types';
import urljoin from 'url-join';
import StorageService from '@/services/storage.service';
import { writeToClipboard } from '@/utils/writeToClipboard';

@Component({
  components: {
    VSwatches,
  },
})
export default class SketchTool extends Mixins(CloseOnEscape) {
  @Inject() storageService!: StorageService;
  @appModule.Action private showToast!: (toast: Toast) => void;
  @Ref() stageRef!: KonvaRef<Stage>;
  @Ref() stageContainer!: HTMLDivElement;
  @Ref() transformer!: KonvaRef<Transformer>;
  @Ref() selectionRect!: KonvaRef<Rect>;
  @Ref() textbox!: HTMLInputElement;

  @Prop() map!: MapID;
  @Prop() userName!: string;
  @Prop() stratName!: string;
  @Prop() roomId!: string;
  @Prop() stratId!: string;
  @Prop() showConfigBtn!: boolean;

  //* Images
  backgroundImage = new Image();
  utilImages!: Record<UtilityTypes, HTMLImageElement>;

  //* Item State
  imageItems: ImageItem[] = [];
  lineItems: LineItem[] = [];
  textItems: TextItem[] = [];

  //* Tool State
  activeItem: KonvaNode | null = null;
  activeTool: ToolTypes = ToolTypes.Pointer;
  // to save previous tool when switching active tool to PAN
  previousTool!: ToolTypes | null;
  isDrawing = false;
  currentLine!: Line | null;
  currentText!: Text | null;
  scale = 1;
  changeHistory: StageState[] = [];
  historyPointer = -1;
  currentColor = '#ffffff'; //'#1fbc9c';

  //* Online State
  remotePointers: RemotePointer[] = [];

  //* Configuration
  readonly linePrecision = 10; // lower = more precise, larger data size
  readonly optimizeThreshold = 4; // lower = more precise, larger data size
  readonly imageSize = 50;
  readonly cursorSize = 25;
  readonly backgroundSize = 1024;

  //* Enum redeclaration for template exposure
  UtilityTypes: typeof UtilityTypes = UtilityTypes;
  ToolTypes: typeof ToolTypes = ToolTypes;

  //* Services
  shortcutService = ShortcutService.getInstance();
  wsService = SocketConnection.getInstance();

  undo(): void {
    if (this.historyPointer > 0) {
      this.historyPointer--;
      const historySnapshot = this.changeHistory[this.historyPointer];
      if (!historySnapshot) return;
      this.applyStageData(historySnapshot);
      this.transformer.getNode().nodes([]);
      this.handleDataChange();
    }
  }

  redo(): void {
    if (this.historyPointer < this.changeHistory.length - 1) {
      this.historyPointer++;
      const historySnapshot = this.changeHistory[this.historyPointer];
      this.applyStageData(historySnapshot);
      this.transformer.getNode().nodes([]);
      this.handleDataChange();
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
      rotation: item.rotation,
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      skewX: item.skewX,
      skewY: item.skewY,
    };
  }

  getRemotePointerCursorConfig(item: RemotePointer): ImageConfig {
    return {
      id: 'cursor_' + item.id,
      x: item.x,
      y: item.y,
      width: this.cursorSize,
      height: this.cursorSize,
      image: item.image,
      class: 'static',
    };
  }

  getRemotePointerTextConfig(item: RemotePointer): TextConfig {
    return {
      id: 'text_' + item.id,
      class: 'static',
      x: item.x + 16,
      y: item.y + 22,
      text: item.userName,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: 'white',
      shadowColor: 'black',
      shadowBlur: 6,
      shadowOpacity: 0.8,
      //shadowOffset: { x: 2, y: 2 },
    };
  }

  getLineItemConfig(item: LineItem): LineConfig {
    return {
      id: item.id,
      x: item.x,
      y: item.y,
      stroke: item.color,
      strokeWidth: 5,
      draggable: this.activeTool === ToolTypes.Pointer,
      lineCap: 'round',
      points: item.points,
      tension: 0.5,
      //bezier: true,
      opacity: 0.8,
      shadowColor: 'black',
      shadowBlur: 16,
      shadowOpacity: 0.5,
      shadowForStrokeEnabled: true,
      shadowOffset: { x: 2, y: 2 },
      rotation: item.rotation,
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      skewX: item.skewX,
      skewY: item.skewY,
    };
  }

  getTextItemConfig(item: TextItem): TextConfig {
    return {
      id: item.id,
      text: item.text,
      fill: item.fill,
      x: item.x,
      y: item.y,
      visible: item.visible,
      draggable: this.activeTool === ToolTypes.Pointer,
      fontSize: item.fontSize,
      fontFamily: 'Calibri',
      shadowColor: 'black',
      shadowBlur: 2,
      shadowOpacity: 0.5,
      shadowForStrokeEnabled: true,
      shadowOffset: { x: 1, y: 1 },
      rotation: item.rotation,
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      skewX: item.skewX,
      skewY: item.skewY,
    };
  }

  backgroundConfig: ImageConfig = {
    id: 'background-image',
    class: 'static',
    x: 0,
    y: 0,
    image: this.backgroundImage,
    width: this.backgroundSize,
    height: this.backgroundSize,
  };

  backgroundRectConfig: RectConfig = {
    id: 'background-rect',
    class: 'static',
    x: 0,
    y: 0,
    fill: '#20242a',
    width: this.backgroundSize,
    height: this.backgroundSize,
    visible: false,
  };

  transformerConfig: TransformerConfig = {
    keepRatio: true,
    centeredScaling: true,
    //* shouldOverdrawWholeArea property has a bug in konva and doesn't fire dblclick events
    //shouldOverdrawWholeArea: true,
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    flipEnabled: false,
    rotateAnchorOffset: 30,
    padding: 5,
    anchorCornerRadius: 5,
    anchorFill: 'rgba(65, 184, 131, 0.6)',
    anchorStroke: 'rgb(65, 184, 131)',
    borderDash: [6],
    borderStroke: 'rgb(65, 184, 131)',
  };

  selectionRectState = {
    x1: -1,
    x2: -1,
    y1: -1,
    y2: -1,
  };

  selectionRectConfig: RectConfig = {
    fill: 'rgba(255,255,255,0.2)',
    width: 0,
    height: 0,
    x: -1,
    y: -1,
    visible: false,
    stroke: 'white',
    strokeWidth: 1,
  };

  getUtilityIcon(type: UtilityTypes) {
    return require(`@/assets/icons/${type.toLowerCase()}.png`);
  }

  getAllNodes(): KonvaNode[] {
    return this.stage.getLayers()[1].children ?? [];
  }

  getScaledPointerPosition(): Vector2d {
    const { x, y } = this.stage.getPointerPosition()!;
    return this.absoluteToScaledPos({ x, y });
  }

  absoluteToScaledPos({ x, y }: Vector2d): Vector2d {
    return {
      x: (x - this.stage.x()) / this.stage.scaleX(),
      y: (y - this.stage.y()) / this.stage.scaleY(),
    };
  }

  scaledToAbsolutePos({ x, y }: Vector2d): Vector2d {
    return {
      x: x * this.stage.scaleX() + this.stage.x(),
      y: y * this.stage.scaleY() + this.stage.y(),
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
        targetScale = clamp(targetScale, 0.5, 2.5);
      }
      if (containerWidth < this.backgroundSize) {
        targetScale = containerWidth / this.backgroundSize;
        // limit to scale of 0.5
        targetScale = clamp(targetScale, 0.5, 2.5);
      }

      targetScale = +targetScale.toFixed(2);

      const targetAttrs = {
        x: containerWidth / 2 - (this.backgroundSize * targetScale) / 2,
        y: containerHeight / 2 - (this.backgroundSize * targetScale) / 2,
        scaleY: targetScale,
        scaleX: targetScale,
      };

      if (noAnim) {
        this.stage.setAttrs(targetAttrs);
        this.scale = targetScale;
        this.moveTextboxElement();
      } else {
        this.stage.to({
          ...targetAttrs,
          duration: 0.2,
          onFinish: () => {
            this.scale = targetScale;
            this.moveTextboxElement();
          },
        });
      }
    }, 200);
  }

  handleDragStart = handleDragStart;

  handleDragOver = handleDragOver;

  handleDragEnd = handleDragEnd;

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
    this.saveStateToHistory();
    this.handleDataChange();
    this.activeTool = ToolTypes.Pointer;
    await this.$nextTick();
    this.setActiveItem(this.stage.findOne('#' + newId));
  }

  created() {
    this.backgroundImage.src = `minimaps/${this.map.toLowerCase()}.png`;

    // cache available utility icons
    this.utilImages = Object.values(UtilityTypes).reduce<any>((acc, type) => {
      acc[type] = createUtilImage(type);
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
    this.lineItems = [];
    this.textItems = [];
    this.setActiveItem(null);
    this.saveStateToHistory();
    this.handleDataChange();
  }

  beforeDestroy() {
    this.wsService.emit('leave-draw-room', { roomId: this.roomId });
    this.wsService.socket?.removeAllListeners();
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
      case 'KeyT':
        this.activeTool = ToolTypes.Text;
        break;
    }
  }

  removeActiveItem(): void {
    if (!this.activeItem) return;
    this.lineItems = this.lineItems.filter(line => line.id !== this.activeItem?.attrs.id);
    this.imageItems = this.imageItems.filter(item => item.id !== this.activeItem?.attrs.id);
    this.textItems = this.textItems.filter(item => item.id !== this.activeItem?.attrs.id);
    this.setActiveItem(null);
    this.saveStateToHistory();
    this.handleDataChange();
  }

  get stage(): Stage {
    return this.stageRef.getStage();
  }

  async handleMouseDown({ target }: KonvaEventObject<MouseEvent>) {
    const pos = this.getScaledPointerPosition();
    const id = nanoid(10);
    switch (this.activeTool) {
      case ToolTypes.Brush:
        this.lineItems.push({
          id,
          points: [pos.x, pos.y, pos.x, pos.y],
          color: this.currentColor,
        });
        await this.$nextTick();
        this.currentLine = this.stage.findOne<Line>('#' + id);
        this.isDrawing = true;
        this.handleDataChange();
        break;
      case ToolTypes.Pointer:
        if (target instanceof KonvaImage && target.attrs.class !== 'static') {
          this.setActiveItem(target);
          return;
        }
        if ((target instanceof Line || target instanceof Text) && target.attrs.class !== 'static') {
          this.setActiveItem(target);
          return;
        }
        if (!(target.parent instanceof Transformer)) {
          // remove activeItem when clicking outside of a node.
          this.setActiveItem(null);
        }
        if ((target instanceof KonvaImage && target.attrs.class === 'static') || target instanceof Stage) {
          // start selection rectangle
          this.selectionRectState.x1 = pos.x;
          this.selectionRectState.x2 = pos.x;
          this.selectionRectState.y1 = pos.y;
          this.selectionRectState.y2 = pos.y;
          this.selectionRectConfig.visible = true;
          return;
        }
        break;
      case ToolTypes.Text:
        this.textItems.push({
          id,
          text: 'Add your text here',
          x: pos.x,
          y: pos.y - 8,
          fontSize: 24,
          fill: this.currentColor,
        });
        await this.$nextTick();
        this.currentText = this.stage.findOne<Text>('#' + id);
        this.showTextbox();
    }
  }

  async showTextbox() {
    if (!this.currentText) return;
    this.currentText.visible(false);
    this.setActiveItem(null);
    this.moveTextboxElement();
    this.textbox.style.display = 'block';
    this.setTextboxColor(this.currentColor);
    this.textbox.innerText = this.currentText.attrs.text;

    await timeout(10);
    this.textbox.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(this.textbox.childNodes[0], 0);
    range.setEnd(this.textbox.childNodes[0], this.textbox.innerText.length);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  setTextboxColor(color: string) {
    const { r, g, b } = Util.getRGB(color);
    this.textbox.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
    this.textbox.style.color = color;
  }

  handleTextboxKeydown(e: KeyboardEvent) {
    if (!this.currentText) return;
    switch (e.code) {
      case 'Enter':
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();

        this.textbox.style.display = 'none';

        this.updateItem(this.currentText.attrs.id, {
          text: this.textbox.innerText,
        });
        this.currentText.visible(true);
        this.currentText = null;
        this.activeTool = ToolTypes.Pointer;
        this.handleDataChange();
        break;
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
    const pos = this.getScaledPointerPosition();
    this.emitPointerPos(pos);
    switch (this.activeTool) {
      case ToolTypes.Brush:
        this.draw(evt);
        break;
      case ToolTypes.Pointer:
        if (this.selectionRectConfig.visible) {
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

  get emitPointerPos(): DebouncedFunc<(pos: Vector2d) => void> {
    return throttle((pos: Vector2d) => {
      if (this.wsService.connected) {
        this.wsService.emit('pointer-position', pos);
      }
    }, 50);
  }

  // draw line on mousemove
  draw(evt: MouseEvent) {
    evt.preventDefault();

    if (!this.isDrawing || !this.currentLine) return;

    const pos = this.getScaledPointerPosition();

    const points = this.currentLine.points();
    const prevX = points[points.length - 4];
    const prevY = points[points.length - 3];

    // only add point if distance to previous point is over linePrecision value
    if (Math.hypot(pos.x - prevX, pos.y - prevY) > this.linePrecision) {
      points.push(pos.x, pos.y);
      this.handleDataChange();
    }
    points[points.length - 2] = pos.x;
    points[points.length - 1] = pos.y;

    this.currentLine.points(points);
  }

  handleMouseUp() {
    switch (this.activeTool) {
      case ToolTypes.Brush:
        if (this.isDrawing) {
          this.isDrawing = false;

          optimizeLine(this.currentLine!, this.optimizeThreshold);
          this.saveStateToHistory();
          this.handleDataChange();

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

  handleMoveTick({ target }: KonvaEventObject<DragEvent>) {
    const pos = this.getScaledPointerPosition();
    this.emitPointerPos(pos);
    if (target instanceof KonvaImage || target instanceof Text || target instanceof Line) {
      const { id, x, y } = target.attrs;
      this.updateItem(id, { x, y });
      this.handleDataChange();
      return;
    }
    if (target instanceof Stage) {
      this.moveTextboxElement();
    }
  }

  //* move the textbox DOM element to the position of the active text node
  moveTextboxElement(): void {
    if (!this.currentText) return;
    const absPos = this.scaledToAbsolutePos({ x: this.currentText.x(), y: this.currentText.y() });
    //? Trying to rotate the offset vector with the textnode rotation
    //? however this doesn't really work and rotated textnodes still jump when dbl clicked.
    const [moveX, moveY] = rotateVector([-6, -12], this.currentText.rotation());
    this.textbox.style.top = absPos.y + moveY + 'px';
    this.textbox.style.left = absPos.x + moveX + 'px';
    this.textbox.style.fontSize = this.currentText.fontSize() * this.scale * this.currentText.scaleX() + 'px';
    this.textbox.style.transform = `rotate(${this.currentText.rotation()}deg)`;
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

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = +newScale.toFixed(2);

    if (newScale < 0.5 || newScale > 3) return;

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
    this.scale = newScale;
    this.moveTextboxElement();
  }

  get updateItem() {
    return throttle((id: string, attributes: Partial<ImageItem | LineItem | TextItem>) => {
      const target = [...this.imageItems, ...this.lineItems, ...this.textItems].find(item => item.id === id);
      if (!target) {
        console.warn(`Stage item with id: ${id} not found`);
        return;
      }
      Object.assign(target, attributes);
    }, 20);
  }

  updateLine(id: string, attributes: Partial<LineItem>): void {
    const target = this.lineItems.find(item => item.id === id);
    if (!target) {
      console.warn(`Line item with id: ${id} not found`);
      return;
    }
    Object.assign(target, attributes);
  }

  handleMoveEnd({ target }: KonvaEventObject<MouseEvent>): void {
    // don't save when target is transformer to prevent duplicate history entry
    if (target instanceof Transformer) return;
    this.saveStateToHistory();
    this.handleDataChange();
  }

  handleTransform({ target }: KonvaEventObject<MouseEvent>) {
    if (target instanceof KonvaImage || target instanceof Text || target instanceof Line) {
      const { id, rotation, scaleX, scaleY, skewX, skewY, x, y } = target.attrs;
      this.updateItem(id, { rotation, scaleX, scaleY, skewX, skewY, x, y });
      this.handleDataChange();
      return;
    }
  }

  handleTransformEnd(): void {
    this.saveStateToHistory();
    this.handleDataChange();
  }

  handleTextDblClick(event: KonvaEventObject<MouseEvent>) {
    this.currentText = event.target as Text;
    this.showTextbox();
  }

  handleColorChange(color: string) {
    if (!this.currentText) return;
    this.updateItem(this.currentText.attrs.id, {
      fill: color,
    });
    this.setTextboxColor(color);
  }

  get handleDataChange(): DebouncedFunc<() => void> {
    return throttle(() => {
      if (this.wsService.connected) {
        this.wsService.emit('update-data', {
          images: this.imageItems,
          lines: this.lineItems,
          texts: this.textItems,
        });
      } else {
        this.serializeAndStore();
      }
    }, 50);
  }

  serializeAndStore(): void {
    const json = JSON.stringify({
      images: this.imageItems,
      lines: this.lineItems,
      texts: this.textItems,
    });
    this.storageService.set('draw-data', json);
  }

  loadFromStorage(): void {
    const data = this.storageService.get('draw-data');
    if (data) this.applyStageData(data);
  }

  // TODO: this is a bit buggy when undoing a change, then creating a new one
  // and then undoing again
  saveStateToHistory(): void {
    console.log('saveStateToHistory');
    if (this.historyPointer < this.changeHistory.length - 1) {
      this.changeHistory.splice(this.historyPointer + 1);
    }
    this.changeHistory.push({
      images: cloneDeep(this.imageItems),
      lines: cloneDeep(this.lineItems),
      texts: cloneDeep(this.textItems),
    });
    this.historyPointer++;
  }

  saveToFile() {
    this.setResponsiveStageSize(true);

    const tempTextNode = new Text({
      x: 16,
      y: 16,
      text: this.stratName ?? 'Unnamed strategy',
      fontSize: 32,
      fontFamily: 'Ubuntu-Bold',
      fill: 'white',
      shadowColor: 'black',
      shadowBlur: 8,
      shadowOpacity: 0.8,
      shadowOffset: { x: 2, y: 2 },
    });

    const bgRectNode = this.stage.findOne('#background-rect');

    const [, contentLayer, utilityLayer] = this.stage.getLayers();

    contentLayer.add(tempTextNode);
    utilityLayer.visible(false);
    bgRectNode.visible(true);

    const dataUri = this.stage.toDataURL({
      pixelRatio: 1.5,
      x: this.stage.x(),
      y: this.stage.y(),
      width: this.backgroundSize,
      height: this.backgroundSize,
    });

    tempTextNode.remove();
    utilityLayer.visible(true);
    bgRectNode.visible(false);

    downloadURI(
      dataUri,
      this.stratName
        ? this.stratName.replaceAll(/[^a-zA-Z ]/g, '').replaceAll(' ', '_') + '.png'
        : `new_strat-${new Date().toISOString()}.png`,
    );
  }

  async connect(targetRoomId?: string) {
    const { roomId, stratName, drawData } = await this.wsService.connect({
      roomId: targetRoomId,
      userName: this.userName,
      stratId: this.stratId,
    });
    Log.success('sketchtool::ws:joined', roomId);
    this.updateRoomId(roomId);
    this.updateStratName(stratName);
    this.applyStageData(drawData);

    // TODO: remove, just for testing
    this.copyRoomLink();

    this.setupListeners();

    if (!this.userName) {
      this.showConnectionDialog();
    }
  }

  @Emit()
  showConnectionDialog() {
    return;
  }

  @Emit()
  updateRoomId(roomId: string) {
    return roomId;
  }

  @Emit()
  updateStratName(stratName: string) {
    return stratName;
  }

  @Watch('userName')
  handleUserNameChange(to: string) {
    console.log('watch username', to);
    this.wsService.emit('update-username', to);
  }

  @Watch('stratName')
  handleStratNameChange(to: string) {
    console.log('watch stratName', to);
    this.wsService.emit('update-stratname', to);
  }

  @Watch('roomId')
  handleRoomChange(to: string) {
    console.log('watch roomid', to);
    this.connect(to);
  }

  applyStageData({ images, lines, texts }: StageState) {
    this.imageItems = images ?? [];
    this.lineItems = lines ?? [];
    this.textItems = texts ?? [];
  }

  copyRoomLink() {
    writeToClipboard(urljoin(window.location.origin, '#', 'map', this.wsService.roomId));
    this.showToast({ id: 'sketchTool/roomlinkCopied', text: 'Room link copied' });
  }

  setupListeners() {
    this.wsService.socket.on('pointer-data', (pointerData: Vector2d & { id: string; userName: string }) => {
      // don't show icon for your own cursor
      if (pointerData.id === this.wsService.clientId) return;

      const remotePointer = this.remotePointers.find(pointer => pointer.id === pointerData.id);
      if (!remotePointer) {
        this.remotePointers = [
          ...this.remotePointers,
          {
            ...pointerData,
            image: createPointerImage(this.remotePointers.length),
          },
        ];
        this.showToast({ id: 'sketchTool/clientJoined', text: `Client with id "${pointerData.id}" joined.` });
      } else {
        const remotePointerCursorNode = this.stage.findOne('#cursor_' + remotePointer.id);
        const remotePointerTextNode = this.stage.findOne('#text_' + remotePointer.id);

        if (remotePointer.timeout) {
          clearTimeout(remotePointer.timeout);
          remotePointer.timeout = undefined;
        }

        remotePointer.timeout = setTimeout(() => {
          fadeOut(remotePointerCursorNode);
          fadeOut(remotePointerTextNode);
        }, 3000);
        fadeIn(remotePointerCursorNode);
        fadeIn(remotePointerTextNode);
        remotePointerCursorNode.to({
          x: pointerData.x,
          y: pointerData.y,
          duration: 0.05,
        });
        remotePointerTextNode.to({
          x: pointerData.x + 16,
          y: pointerData.y + 22,
          duration: 0.05,
        });
      }
    });

    this.wsService.socket.on('data-updated', (data: StageState & { id: string }) => {
      // console.log('data-updated', { images, lines, texts, id });
      if (data.id === this.wsService.clientId) return;
      this.applyStageData(data);
    });

    this.wsService.socket.on('username-updated', ({ userName, id }: { userName: string; id: string }) => {
      console.log('username-updated', { userName, id });
      if (id === this.wsService.clientId) return;
      const remotePointer = this.remotePointers.find(i => i.id === id);
      if (remotePointer) {
        remotePointer.userName = userName;
        console.log('remote pointer updated');
      }
    });

    this.wsService.socket.on('stratname-updated', ({ stratName, id }: { stratName: string; id: string }) => {
      console.log('stratname-updated', { stratName, id });
      if (id === this.wsService.clientId) return;
      this.updateStratName(stratName);
    });
  }

  mounted() {
    this.setResponsiveStageSize(true);

    if (this.roomId) this.connect(this.roomId);

    this.saveStateToHistory();

    console.log('mounted');

    // for testing
    (window as any).konva = this.stage;
    (window as any).saveToFile = this.saveToFile;
    (window as any).loadjson = this.loadFromStorage;
    (window as any).dialog = this.showConnectionDialog;
  }
}
