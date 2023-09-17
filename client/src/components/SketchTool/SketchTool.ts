import { Component, Mixins, Prop, Ref, Inject, Emit } from 'vue-property-decorator';
import CloseOnEscape from '@/mixins/CloseOnEscape';
import { appModule, teamModule } from '@/store/namespaces';
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
import { Listen } from '@/utils/decorators/listen.decorator';
import {
  clamp,
  createMapImage,
  createPlayerImage,
  createPointerImage,
  createUtilImage,
  fadeIn,
  fadeOut,
  handleDragOver,
  handleDragStart,
  optimizeLine,
  rotateVector,
} from './utils';
import VSwatches from 'vue-swatches';
import { timeout } from '@/utils/timeout';
import { Vector2d } from 'konva/lib/types';
import { Log } from '@/utils/logger';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import { KonvaRef, ImageItem, LineItem, TextItem, ToolTypes, ItemState, RemoteClient, StoredItemState } from './types';
import urljoin from 'url-join';
import StorageService from '@/services/storage.service';
import { writeToClipboard } from '@/utils/writeToClipboard';
import WebSocketService from '@/services/WebSocketService';
import { Circle, CircleConfig } from 'konva/lib/shapes/Circle';
import { GameMap } from '@/api/models/GameMap';
import { isInputFocussed } from '@/utils/inputFocussed';
import TrackingService from '@/services/tracking.service';
import { APP_URL } from '@/config';
import isMobile from 'is-mobile';
import { Dialog } from '../DialogWrapper/DialogWrapper.models';
import { COLORS } from '@/constants/colors';
import { Player } from '@/api/models/Player';
import VueContext from 'vue-context';
import { PlayerItem } from './types';

@Component({
  components: {
    VSwatches,
    VueContext,
  },
})
export default class SketchTool extends Mixins(CloseOnEscape) {
  @Inject() storageService!: StorageService;

  @appModule.Action private showToast!: (toast: Toast) => void;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @teamModule.State teamMembers!: Player[];

  @Ref() stageRef!: KonvaRef<Stage>;
  @Ref() stageContainer!: HTMLDivElement;
  @Ref() transformerRef!: KonvaRef<Transformer>;
  @Ref() selectionRectRef!: KonvaRef<Rect>;
  @Ref() pointerRef!: KonvaRef<Circle>;
  @Ref() textbox!: HTMLInputElement;
  @Ref() playerPicker!: Vue & any;

  @Prop() map!: GameMap;
  @Prop() userName!: string;
  @Prop() stratName!: string;
  @Prop() roomId!: string;
  @Prop() stratId!: string;
  @Prop() isMapView!: boolean;

  //* Images
  utilImages!: Record<UtilityTypes, HTMLImageElement>;
  mapImages!: Record<GameMap, HTMLImageElement>;

  //* Item State
  itemState: ItemState = {
    images: [],
    lines: [],
    texts: [],
    players: [],
  };

  //* Tool State
  activeTool: ToolTypes = ToolTypes.Pointer;
  // to save previous tool when switching active tool to PAN
  previousTool!: ToolTypes | null;
  isDrawing = false;
  currentLine!: Line | null;
  currentText!: Text | null;
  scale = 1;
  changeHistory: ItemState[] = [];
  historyPointer = -1;
  currentColor = '#ffffff'; //'#1fbc9c';
  // reject function of promise created by player icon context menu
  rejectPromise!: () => any;

  //* Online State
  remoteClients: RemoteClient[] = [];

  //* Other State
  mouseOverStage: boolean = false;

  //* Configuration
  readonly linePrecision = 10; // lower = more precise, larger data size
  readonly optimizeThreshold = 4; // lower = more precise, larger data size
  readonly imageSize = 50;
  readonly cursorSize = 25;
  readonly backgroundSize = 1024;
  readonly swatches = COLORS;

  //* Enum redeclaration for template exposure
  UtilityTypes: typeof UtilityTypes = UtilityTypes;
  ToolTypes: typeof ToolTypes = ToolTypes;

  //* Services
  wsService = WebSocketService.getInstance();
  trackingService = TrackingService.getInstance();

  get flatItemState() {
    return Object.values(this.itemState).flat();
  }

  undo(): void {
    if (this.historyPointer > 0) {
      this.historyPointer--;
      const historySnapshot = this.changeHistory[this.historyPointer];
      if (!historySnapshot) return;
      this.applyStageData(historySnapshot);
      this.transformer.nodes([]);
      this.handleDataChange();
    }
  }

  redo(): void {
    if (this.historyPointer < this.changeHistory.length - 1) {
      this.historyPointer++;
      const historySnapshot = this.changeHistory[this.historyPointer];
      this.applyStageData(historySnapshot);
      this.transformer.nodes([]);
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

  getPlayerItemConfig(item: PlayerItem): ImageConfig {
    return {
      id: item.id,
      x: item.x,
      y: item.y,
      width: 35,
      height: 35,
      strokeWidth: 1,
      draggable: this.activeTool === ToolTypes.Pointer,
      //! potential memory leak
      image: createPlayerImage(item.color),
      rotation: item.rotation,
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      skewX: item.skewX,
      skewY: item.skewY,
      type: 'player',
      offset: { x: 35 / 2, y: 35 / 2 },
    };
  }

  getPlayerTextItemConfig(item: PlayerItem): TextConfig {
    return {
      id: 'text_' + item.id,
      text: item.name,
      fill: item.color,
      x: item.x,
      y: item.y + 40,
      width: 150,
      align: 'center',
      verticalAlign: 'center',
      ellipsis: true,
      visible: true,
      draggable: false,
      fontSize: 18,
      fontFamily: 'Ubuntu',
      shadowColor: 'black',
      shadowBlur: 2,
      shadowOpacity: 0.5,
      shadowForStrokeEnabled: true,
      shadowOffset: { x: 1, y: 1 },
      type: 'player-text',
      class: 'static',
      offset: { x: 75, y: 9 },
    };
  }

  getRemoteClientCursorConfig(item: RemoteClient): ImageConfig {
    return {
      id: 'cursor_' + item.id,
      x: item.position.x,
      y: item.position.y,
      width: this.cursorSize,
      height: this.cursorSize,
      image: item.image,
      class: 'static',
      visible: item.pointerVisible,
    };
  }

  getRemoteClientTextConfig(item: RemoteClient): TextConfig {
    return {
      id: 'text_' + item.id,
      class: 'static',
      x: item.position.x + 16,
      y: item.position.y + 22,
      text: item.userName,
      fontSize: 14,
      fontFamily: 'Ubuntu',
      fill: 'white',
      shadowColor: 'black',
      shadowBlur: 6,
      shadowOpacity: 0.8,
      visible: item.pointerVisible,
    };
  }

  get pointerConfig(): CircleConfig {
    return {
      class: 'static',
      visible: this.activeTool === ToolTypes.Brush && this.mouseOverStage,
      width: 6,
      height: 6,
      fill: this.currentColor,
    };
  }

  getLineItemConfig(item: LineItem): LineConfig {
    return {
      id: item.id,
      x: item.x,
      y: item.y,
      stroke: item.color,
      strokeWidth: 6,
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
      fontFamily: 'Ubuntu',
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
      type: 'text',
    };
  }

  get backgroundConfig(): ImageConfig {
    return {
      id: 'background-image',
      class: 'static',
      x: 0,
      y: 0,
      image: this.mapImages[this.map],
      width: this.backgroundSize,
      height: this.backgroundSize,
    };
  }

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

  get transformerConfig(): TransformerConfig {
    return {
      keepRatio: true,
      //centeredScaling: true,
      rotateEnabled:
        this.activeItems.length === 1 &&
        (this.activeItems[0].attrs.type === 'player' || this.activeItems[0].attrs.type === 'text'),
      //* shouldOverdrawWholeArea property has a bug in konva and doesn't fire dblclick events
      //shouldOverdrawWholeArea: true,
      enabledAnchors:
        this.activeItems.length === 1 && this.activeItems[0].attrs.type === 'text'
          ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
          : [],
      flipEnabled: false,
      rotateAnchorOffset: 30,
      padding: 5,
      anchorCornerRadius: 5,
      anchorFill: 'rgba(65, 184, 131, 0.6)',
      anchorStroke: 'rgb(65, 184, 131)',
      borderDash: [6],
      borderStroke: 'rgb(65, 184, 131)',
      resizeEnabled: this.activeItems.length === 1 && this.activeItems[0].attrs.type === 'text',
    };
  }

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

  // displays context menu and returns promise with selected player
  showPlayerPicker(e: Event): Promise<Player> {
    e.preventDefault();
    e.stopImmediatePropagation();
    return new Promise((resolve, reject) => {
      this.rejectPromise = reject;
      this.playerPicker.open(e, { callback: resolve });
    });
  }

  rejectPlayerPicker() {
    if (this.rejectPromise) this.rejectPromise();
  }

  async handleDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    event.preventDefault();

    const type = event.dataTransfer.getData('text/plain');

    this.stage.setPointersPositions(event);

    const pos = this.getScaledPointerPosition();
    const newId = nanoid(10);

    if (type === 'PLAYER') {
      try {
        const player = this.teamMembers.length ? await this.showPlayerPicker(event) : null;
        // if player is undefined, the user selected "selected color" in the context menu
        this.itemState.players.push({
          id: newId,
          x: pos!.x,
          y: pos!.y,
          ...(player && { name: player.name }),
          ...(player && { playerId: player._id }),
          color: player ? player.color : this.currentColor,
          image: createPlayerImage(player ? player.color : this.currentColor),
        });
      } catch (_) {
        return;
      }
    } else {
      this.itemState.images.push({
        id: newId,
        x: pos!.x - this.imageSize / 2,
        y: pos!.y - this.imageSize / 2,
        type: type as UtilityTypes,
      });
    }

    this.saveStateToHistory();
    this.handleDataChange();
    this.setActiveTool(ToolTypes.Pointer);
    await this.$nextTick();
    this.setActiveItems([this.stage.findOne('#' + newId)]);
  }

  created() {
    // cache available utility icons
    this.utilImages = Object.values(UtilityTypes).reduce<Record<string, HTMLImageElement>>((acc, type) => {
      acc[type] = createUtilImage(type);
      return acc;
    }, {});

    // cache available map images
    this.mapImages = Object.values(GameMap).reduce<Record<string, HTMLImageElement>>((acc, map) => {
      acc[map] = createMapImage(map);
      return acc;
    }, {});
  }

  clearStage(): void {
    Object.keys(this.itemState).forEach((key) => (this.itemState[key] = []));
    this.setActiveItems([]);
    this.saveStateToHistory();
    this.handleDataChange();
  }

  leaveRoom() {
    this.wsService.emit('leave-draw-room');
    this.removeSocketListeners();
    this.storageService.remove('draw-room-id');
    this.storageService.remove('draw-data');
    this.updateRoomId('');
    this.updateStratName('');
    this.remoteClients = [];
    this.clearStage();
    this.showToast({
      id: 'SketchTool::leaveRoom',
      text: 'Room left.',
    });
    this.$router.replace({ path: '/map' });
    this.trackingService.track('Action: Leave Draw Room');
  }

  removeSocketListeners() {
    this.wsService.socket?.off('pointer-data');
    this.wsService.socket?.off('data-updated');
    this.wsService.socket?.off('username-updated');
    this.wsService.socket?.off('stratname-updated');
    this.wsService.socket?.off('map-updated');
    this.wsService.socket?.off('client-joined');
    this.wsService.socket?.off('client-left');
  }

  beforeDestroy() {
    this.wsService.emit('leave-draw-room');
    this.removeSocketListeners();
  }

  @Listen('keyup')
  keyupHandler({ key }: KeyboardEvent) {
    if (this.currentText || isInputFocussed()) return;
    switch (key) {
      case ' ':
        this.setActiveTool(this.previousTool ?? ToolTypes.Pan);
        this.previousTool = null;
    }
  }

  @Listen('keydown')
  keydownHandler({ key, ctrlKey }: KeyboardEvent) {
    if (this.currentText || isInputFocussed() || ctrlKey) return;
    switch (key) {
      case ' ':
        if (this.activeTool === ToolTypes.Pan) return;
        this.previousTool = this.activeTool;
        this.setActiveTool(ToolTypes.Pan);
        break;
      case 'v':
        this.setActiveTool(ToolTypes.Pointer);
        break;
      case 'b':
        this.setActiveTool(ToolTypes.Brush);
        this.pointerRef.getNode().position(this.getScaledPointerPosition());
        break;
      case 't':
        this.setActiveTool(ToolTypes.Text);
        break;
      case 'r':
        this.clearStage();
        break;
      case 'z':
        this.undo();
        break;
      case 'y':
        this.redo();
        break;
      case 'c':
        this.setResponsiveStageSize();
        break;
      case 'Delete':
        this.removeActiveItems();
        break;
    }
  }

  removeActiveItems(): void {
    if (!this.activeItems.length) return;
    Object.keys(this.itemState).forEach(
      (key) =>
        (this.itemState[key] = this.itemState[key].filter(
          (item) => !this.activeItems.some((activeItem) => activeItem.attrs.id === item.id),
        )),
    );
    this.setActiveItems([]);
    this.saveStateToHistory();
    this.handleDataChange();
  }

  get stage(): Stage {
    return this.stageRef.getStage();
  }

  get transformer(): Transformer {
    return this.transformerRef.getNode();
  }

  activeItems: KonvaNode[] = [];

  setActiveItems(items: KonvaNode[]) {
    if (
      items.length === 1 &&
      items.some((item) => this.activeItems.some((activeItem) => activeItem.attrs.id === item.attrs.id))
    )
      return;
    this.activeItems = items;
    this.transformer.nodes(items);
  }

  setActiveTool(tool: ToolTypes): void {
    this.setActiveItems([]);
    this.submitText();
    this.activeTool = tool;
  }

  async handleMouseDown({ target }: KonvaEventObject<MouseEvent>) {
    const pos = this.getScaledPointerPosition();
    const id = nanoid(10);
    switch (this.activeTool) {
      case ToolTypes.Brush:
        this.itemState.lines.push({
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
          this.setActiveItems([target]);
          return;
        }
        if ((target instanceof Line || target instanceof Text) && target.attrs.class !== 'static') {
          this.setActiveItems([target]);
          return;
        }
        if (!(target.parent instanceof Transformer)) {
          // remove activeItem when clicking outside of a node.
          this.setActiveItems([]);
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
        if (target instanceof Text) {
          this.submitText();
          this.currentText = target;
          this.showTextbox();
        } else if (!this.currentText) {
          this.submitText();
          this.itemState.texts.push({
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
        } else {
          this.submitText();
        }
    }
  }

  handleMouseLeave() {
    this.mouseOverStage = false;
    this.handleMouseUp();
  }

  handleMouseEnter() {
    this.mouseOverStage = true;
  }

  async showTextbox() {
    if (!this.currentText) return;
    this.currentText.visible(false);
    this.setActiveItems([]);
    this.moveTextboxElement();
    this.textbox.style.display = 'block';
    this.setTextboxColor(this.currentText.attrs.fill);
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

  submitText(): void {
    if (!this.currentText) return;
    this.textbox.style.display = 'none';

    this.updateItem(this.currentText.attrs.id, {
      text: this.textbox.innerText,
    });
    this.currentText.visible(true);
    this.currentText = null;
    this.handleDataChange();
    this.saveStateToHistory();
  }

  handleTextboxKeydown(e: KeyboardEvent) {
    if (!this.currentText) return;
    switch (e.code) {
      case 'Enter':
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        this.submitText();
        break;
    }
  }

  handleMouseMove({ evt }: KonvaEventObject<MouseEvent>) {
    const pos = this.getScaledPointerPosition();
    this.emitPointerPos(pos);
    switch (this.activeTool) {
      case ToolTypes.Brush:
        this.pointerRef.getNode().position(pos);
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
          const box = this.selectionRectRef.getNode().getClientRect();
          const selectedNodes = this.getAllNodes().filter(
            (node) => Util.haveIntersection(box, node.getClientRect()) && node.attrs.type !== 'player-text',
          );
          this.setActiveItems(selectedNodes);
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
      this.handleDataChange(false);
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
          const lineItem = this.itemState.lines.find((i) => i.id === this.currentLine?.attrs.id);
          optimizeLine(lineItem!, this.optimizeThreshold);
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
      this.handleDataChange(false);
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
      const target = this.flatItemState.find((item) => item.id === id);
      if (!target) {
        console.warn(`Stage item with id: ${id} not found`);
        return;
      }
      Object.assign(target, attributes);
    }, 20);
  }

  updateLine(id: string, attributes: Partial<LineItem>): void {
    const target = this.itemState.lines.find((item) => item.id === id);
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
      const items = this.transformer.nodes();

      for (const item of items) {
        const { id, rotation, scaleX, scaleY, skewX, skewY, x, y } = item.attrs;
        this.updateItem(id, { rotation, scaleX, scaleY, skewX, skewY, x, y });
      }
      this.handleDataChange(false);
      return;
    }
  }

  handleTransformEnd({ target }: KonvaEventObject<MouseEvent>): void {
    if (target instanceof KonvaImage || target instanceof Text || target instanceof Line) {
      const items = this.transformer.nodes();
      for (const item of items) {
        const { id, rotation, scaleX, scaleY, skewX, skewY, x, y } = item.attrs;
        this.updateItem(id, { rotation, scaleX, scaleY, skewX, skewY, x, y });
      }
      this.handleDataChange();
      this.saveStateToHistory();
      return;
    }
  }

  handleTextDblClick(event: KonvaEventObject<MouseEvent>) {
    //* Order is important here.
    this.setActiveTool(ToolTypes.Text);
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

  get handleDataChange(): DebouncedFunc<(serialize?: boolean) => void> {
    return throttle((serialize = true) => {
      if (this.wsService.connected) {
        this.wsService.emit('update-data', this.itemState);
      } else if (serialize) {
        this.serializeAndStore();
      }
    }, 50);
  }

  serializeAndStore(): void {
    const existingData = this.storageService.get<StoredItemState>('draw-data');

    const json = JSON.stringify({
      ...existingData,
      [this.map]: this.itemState,
    });
    this.storageService.set('draw-data', json);
  }

  loadFromStorage(): void {
    const data = this.storageService.get<StoredItemState>('draw-data');
    this.applyStageData(data?.[this.map] ?? {});
  }

  // TODO: this is a bit buggy when undoing a change, then creating a new one
  // and then undoing again
  saveStateToHistory(): void {
    if (this.historyPointer < this.changeHistory.length - 1) {
      this.changeHistory.splice(this.historyPointer + 1);
    }
    this.changeHistory.push(cloneDeep(this.itemState));
    this.historyPointer++;
  }

  saveToFile() {
    this.setResponsiveStageSize(true);

    const tempTextNode = new Text({
      x: 16,
      y: 16,
      text: this.stratName ?? 'Unnamed strategy',
      fontSize: 32,
      fontFamily: 'Ubuntu',
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
    this.trackingService.track('Action: Save To File');
  }

  async connect(targetRoomId?: string) {
    if (!targetRoomId) {
      this.trackingService.track(`Action: Create Draw Room`, {
        map: this.map,
      });
    }
    const { roomId, stratName, drawData, map, clients, userName, color } = await this.wsService.joinDrawRoom({
      roomId: targetRoomId,
      userName: this.userName,
      stratId: this.stratId,
      map: this.map,
    });
    Log.success('SketchTool::connect', 'Room joined. Response:', {
      roomId,
      stratName,
      drawData,
      map,
      clients,
      userName,
    });
    if (this.isMapView) this.showToast({ id: 'SketchTool::connect', text: 'Room joined.' });
    this.currentColor = color;
    this.updateRoomId(roomId);
    this.updateMap(map);
    this.updateUserName(userName);
    this.updateStratName(stratName);
    this.applyStageData(drawData);
    this.remoteClients = clients.map((client) => ({
      ...client,
      image: createPointerImage(client.color),
      pointerVisible: false,
    }));

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

  @Emit()
  updateUserName(userName: string) {
    return userName;
  }

  @Emit()
  updateMap(map: GameMap) {
    return map;
  }

  submitUserName(userName: string) {
    Log.info('Sketchtool::submitUserName', userName);
    this.wsService.emit('update-username', userName);
  }

  submitStratName(stratName: string) {
    Log.info('Sketchtool::submitStratName', stratName);
    this.wsService.emit('update-stratname', stratName);
  }

  connectToRoomId(roomId: string) {
    Log.info('Sketchtool::connectToRoomId', roomId);
    this.connect(roomId);
  }

  changeMap(map: GameMap) {
    Log.info('Sketchtool::changeMap', map);
    if (this.wsService.connected) {
      this.wsService.emit('update-map', map);
    } else {
      this.updateMap(map);
      this.setActiveItems([]);
      this.$nextTick().then(() => this.loadFromStorage());
    }
  }

  applyStageData(itemState: Partial<ItemState>) {
    Object.entries(this.itemState).forEach(([key]) => {
      this.itemState[key] = itemState[key] ?? [];
    });
  }

  copyRoomLink() {
    writeToClipboard(urljoin(APP_URL, '/', '/#/map', this.roomId));
    this.showToast({ id: 'sketchTool/roomlinkCopied', text: 'Room link copied' });
  }

  setupListeners() {
    this.wsService.socket.on('pointer-data', (pointerData) => {
      // don't show icon for your own cursor
      if (pointerData.id === this.wsService.socket.id) return;

      const remoteClient = this.remoteClients.find((client) => client.id === pointerData.id);
      if (!remoteClient) return;

      const remoteClientCursorNode = this.stage.findOne('#cursor_' + remoteClient.id);
      const remoteClientTextNode = this.stage.findOne('#text_' + remoteClient.id);

      remoteClient.pointerVisible = true;

      if (remoteClient.timeout) {
        clearTimeout(remoteClient.timeout);
        remoteClient.timeout = undefined;
      }

      remoteClient.timeout = setTimeout(() => {
        fadeOut(remoteClientCursorNode);
        fadeOut(remoteClientTextNode);
      }, 3000);
      fadeIn(remoteClientCursorNode);
      fadeIn(remoteClientTextNode);
      remoteClientCursorNode.to({
        x: pointerData.x,
        y: pointerData.y,
        duration: 0.05,
      });
      remoteClientTextNode.to({
        x: pointerData.x + 16,
        y: pointerData.y + 22,
        duration: 0.05,
      });
    });

    this.wsService.socket.on('data-updated', (data) => {
      if (data.id === this.wsService.socket.id) return;
      this.applyStageData(data);
    });

    this.wsService.socket.on('username-updated', ({ userName, id }) => {
      Log.info('sketchtool::username-updated', { userName, id });
      const remoteClient = this.remoteClients.find((i) => i.id === id);
      if (remoteClient) {
        remoteClient.userName = userName;
      }
    });

    this.wsService.socket.on('stratname-updated', ({ stratName, id }) => {
      Log.info('sketchtool::stratname-updated', { stratName, id });
      if (id === this.wsService.socket.id) return;
      this.updateStratName(stratName);
    });

    this.wsService.socket.on('map-updated', ({ map, stratName, drawData, id }) => {
      Log.info('sketchtool::map-updated', { map, id, stratName, drawData });
      this.updateMap(map);
      this.setActiveItems([]);
      this.applyStageData(drawData);
      this.updateStratName(stratName ?? '');
    });

    this.wsService.socket.on('client-joined', ({ position, id, color, userName }) => {
      Log.info('sketchtool::client-joined', userName, color);
      const clientExists = this.remoteClients.some((client) => client.id === id);

      if (id === this.wsService.socket.id) {
        this.currentColor = color;
      } else if (!clientExists) {
        this.remoteClients = [
          ...this.remoteClients,
          {
            id,
            position,
            color,
            userName,
            image: createPointerImage(color),
            pointerVisible: false,
          },
        ];
      }
    });

    this.wsService.socket.on('client-left', ({ clientId }) => {
      Log.info('sketchtool::client-left', clientId);
      if (clientId === this.wsService.socket.id) return;
      this.remoteClients = this.remoteClients.filter((client) => client.id !== clientId);
    });
  }

  mounted() {
    this.setResponsiveStageSize(true);

    if (this.roomId) this.connect(this.roomId);

    this.saveStateToHistory();

    if (isMobile() && !this.storageService.get('mobile-warning-shown')) {
      this.showDialog({
        key: 'sketch-tool/mobile-warning',
        text: `Hi there! The tactics board is not working well on mobile devices yet. For the best experience, please use a Desktop PC or Laptop.`,
        resolveBtn: 'OK',
        confirmOnly: true,
      }),
        this.storageService.set('mobile-warning-shown', true);
    }
  }
}
