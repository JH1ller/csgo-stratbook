<template>
  <BackdropDialog>
    <div class="draw-tool">
      <div class="draw-tool__wrapper" ref="wrapper">
        <ImageEditor
          class="draw-tool__editor"
          :color="currentColor"
          :canvasWidth="canvasWidth"
          :canvasHeight="canvasHeight"
          ref="editor"
        />
        <img class="draw-tool__background" :src="mapURL" />
        <span class="draw-tool__legend"><span>Undo: CTRL + Z</span><span>Redo: CTRL + SHIFT + Z</span></span>
      </div>
      <div class="draw-tool__actions">
        <v-swatches
          class="draw-tool__color-picker"
          v-model="currentColor"
          shapes="circles"
          swatch-size="30"
          popover-y="top"
          popover-x="right"
        ></v-swatches>
        <button
          class="draw-tool__btn"
          :class="{ '-active': activeTool === 'selectMode' }"
          @click="setTool('selectMode')"
        >
          <fa-icon icon="arrows-alt" />
        </button>
        <button class="draw-tool__btn" :class="{ '-active': activeTool === 'circle' }" @click="setTool('circle')">
          <fa-icon :icon="['far', 'circle']" />
        </button>
        <button
          class="draw-tool__btn"
          :class="{ '-active': activeTool === 'freeDrawing' }"
          @click="setTool('freeDrawing')"
        >
          <fa-icon icon="pencil-alt" />
        </button>
        <button class="draw-tool__btn" @click="clear">
          <fa-icon icon="eraser" /><span class="draw-tool__btn-label">Clear</span>
        </button>
        <button class="draw-tool__btn" @click="close">
          <fa-icon icon="ban" /><span class="draw-tool__btn-label">Close</span>
        </button>
      </div>
    </div>
  </BackdropDialog>
</template>

<script lang="ts" src="./DrawTool.ts"></script>
<style lang="scss" src="./DrawTool.scss"></style>
