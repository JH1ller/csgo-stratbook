<template>
  <BackdropDialog :fullscreen="true">
    <div class="sketch-tool">
      <span class="sketch-tool__strat-name">{{ strat.name }}</span>
      <div
        class="sketch-tool__stage"
        :class="'-' + activeTool.toLowerCase()"
        ref="stageContainer"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <v-stage
          :config="getStageConfig()"
          ref="stageRef"
          @dragstart="handleMoveStart"
          @dragend="handleMoveEnd"
          @dragmove="handleMoveTick"
          @mousedown="handleMouseDown"
          @touchstart="handleMouseDown"
          @mousemove="handleMouseMove"
          @touchmove="handleMouseMove"
          @mouseup="handleMouseUp"
          @touchup="handleMouseUp"
          @mouseleave="handleMouseUp"
          @wheel="handleZoom"
        >
          <v-layer>
            <v-image :config="backgroundConfig" />
          </v-layer>
          <v-layer>
            <v-image v-for="item in imageItems" :key="item.id" :config="getImageItemConfig(item)" />
            <v-line v-for="item in lines" :key="item.id" :config="getLineItemConfig(item)" />
          </v-layer>
          <v-layer>
            <v-transformer ref="transformer" />
            <v-rect :config="selectionRectConfig" ref="selectionRect" />
          </v-layer>
        </v-stage>
      </div>
      <div class="sketch-tool__toolbar">
        <v-swatches
          class="sketch-tool__color-picker"
          v-model="currentColor"
          shapes="circles"
          swatch-size="30"
          popover-y="top"
          popover-x="right"
        ></v-swatches>
        <button
          class="sketch-tool__btn"
          :class="{ '-active': activeTool === ToolTypes.Pointer }"
          @click="activeTool = ToolTypes.Pointer"
        >
          <fa-icon icon="mouse-pointer" /><span class="sketch-tool__btn-label">Pointer</span>
        </button>
        <button
          class="sketch-tool__btn"
          :class="{ '-active': activeTool === ToolTypes.Brush }"
          @click="activeTool = ToolTypes.Brush"
        >
          <fa-icon icon="pencil-alt" /><span class="sketch-tool__btn-label">Draw</span>
        </button>
        <button
          class="sketch-tool__btn"
          :class="{ '-active': activeTool === ToolTypes.Pan }"
          @click="activeTool = ToolTypes.Pan"
        >
          <fa-icon icon="arrows-alt" /><span class="sketch-tool__btn-label">Pan</span>
        </button>
        <button
          class="sketch-tool__btn"
          :class="{ '-active': activeTool === ToolTypes.Text }"
          @click="activeTool = ToolTypes.Text"
        >
          <fa-icon icon="i-cursor" /><span class="sketch-tool__btn-label">Text</span>
        </button>
        <button class="sketch-tool__btn" @click="clearStage">
          <fa-icon icon="eraser" /><span class="sketch-tool__btn-label">Clear</span>
        </button>
        <button class="sketch-tool__btn" @click="setResponsiveStageSize()">
          <fa-icon icon="align-center" /><span class="sketch-tool__btn-label">Center</span>
        </button>
        <button class="sketch-tool__btn" @click="saveToFile">
          <fa-icon icon="download" /><span class="sketch-tool__btn-label">Save as file</span>
        </button>
      </div>
      <div class="sketch-tool__draggables-bar">
        <div
          class="sketch-tool__draggable"
          draggable="true"
          @dragstart="handleDragStart($event, UtilityTypes.GRENADE)"
          @dragend="handleDragEnd"
        >
          <img src="@/assets/icons/grenade.png" />
        </div>
        <div
          class="sketch-tool__draggable"
          draggable="true"
          @dragstart="handleDragStart($event, UtilityTypes.MOLOTOV)"
          @dragend="handleDragEnd"
        >
          <img src="@/assets/icons/molotov.png" />
        </div>
        <div
          class="sketch-tool__draggable"
          draggable="true"
          @dragstart="handleDragStart($event, UtilityTypes.SMOKE)"
          @dragend="handleDragEnd"
        >
          <img src="@/assets/icons/smoke.png" />
        </div>
      </div>
    </div>
  </BackdropDialog>
</template>

<script lang="ts" src="./SketchTool.ts"></script>
<style lang="scss" src="./SketchTool.scss"></style>
