<template>
  <div class="sketch-tool">
    <span v-if="stratName" class="sketch-tool__strat-name">{{ stratName }}</span>
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
        @dragend="handleMoveEnd"
        @dragmove="handleMoveTick"
        @mousedown="handleMouseDown"
        @touchstart="handleMouseDown"
        @mousemove="handleMouseMove"
        @touchmove="handleMouseMove"
        @mouseup="handleMouseUp"
        @touchup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @wheel="handleZoom"
      >
        <!-- Background layer without events -->
        <v-layer :config="{ listening: false }">
          <v-rect :config="backgroundRectConfig" />
          <v-image :config="backgroundConfig" />
        </v-layer>
        <!-- Main content layer -->
        <v-layer>
          <v-image v-for="item in imageItems" :key="item.id" :config="getImageItemConfig(item)" />
          <v-line v-for="item in lineItems" :key="item.id" :config="getLineItemConfig(item)" />
          <v-text
            v-for="item in textItems"
            :key="item.id"
            :config="getTextItemConfig(item)"
            @dblclick="handleTextDblClick"
          />
        </v-layer>
        <!-- Overlayed utility layer -->
        <v-layer>
          <v-transformer
            ref="transformerRef"
            :config="transformerConfig"
            @transform="handleTransform"
            @transformend="handleTransformEnd"
          />
          <v-rect :config="selectionRectConfig" ref="selectionRectRef" />
          <v-image v-for="item in remoteClients" :key="'i' + item.id" :config="getRemoteClientCursorConfig(item)" />
          <v-text v-for="item in remoteClients" :key="'t' + item.id" :config="getRemoteClientTextConfig(item)" />
          <v-circle :config="pointerConfig" ref="pointerRef" />
        </v-layer>
      </v-stage>
      <span role="textbox" contenteditable ref="textbox" class="sketch-tool__textbox" @keydown="handleTextboxKeydown" />
    </div>
    <div class="sketch-tool__toolbar">
      <v-swatches
        class="sketch-tool__color-picker"
        v-model="currentColor"
        shapes="circles"
        swatch-size="30"
        popover-y="top"
        popover-x="right"
        @input="handleColorChange"
      ></v-swatches>
      <button
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Pointer }"
        @click="activeTool = ToolTypes.Pointer"
        v-tippy
        content="Pointer (V)"
      >
        <fa-icon icon="mouse-pointer" /><span class="sketch-tool__btn-label">Pointer</span>
      </button>
      <button
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Brush }"
        @click="activeTool = ToolTypes.Brush"
        v-tippy
        content="Brush (B)"
      >
        <fa-icon icon="pencil-alt" /><span class="sketch-tool__btn-label">Draw</span>
      </button>
      <button
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Pan }"
        @click="activeTool = ToolTypes.Pan"
        v-tippy
        content="Pan (Space)"
      >
        <fa-icon icon="arrows-alt" /><span class="sketch-tool__btn-label">Pan</span>
      </button>
      <button
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Text }"
        @click="activeTool = ToolTypes.Text"
        v-tippy
        content="Text (T)"
      >
        <fa-icon icon="i-cursor" /><span class="sketch-tool__btn-label">Text</span>
      </button>
      <button class="sketch-tool__btn" @click="saveToFile" v-tippy content="Save to file">
        <fa-icon icon="download" /><span class="sketch-tool__btn-label">Save to file</span>
      </button>
      <template>
        <button v-if="!roomId" class="sketch-tool__btn" @click="() => connect()" v-tippy content="Create room">
          <fa-icon icon="network-wired" /><span class="sketch-tool__btn-label">Create room</span>
        </button>
        <!-- <button v-else class="sketch-tool__btn" @click="copyRoomLink" v-tippy content="Copy link">
          <fa-icon icon="copy" /><span class="sketch-tool__btn-label">Copy link</span>
        </button> -->
      </template>
      <button
        v-if="showConfigBtn && roomId"
        class="sketch-tool__btn"
        @click="showConnectionDialog"
        v-tippy
        content="Connection"
      >
        <fa-icon icon="cog" /><span class="sketch-tool__btn-label">Connection</span>
      </button>
    </div>
    <div class="sketch-tool__draggables-bar">
      <div
        class="sketch-tool__draggable -anim"
        v-for="item in UtilityTypes"
        :key="item"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragend="handleDragEnd"
        @animationend="e => e.target.classList.remove('-anim')"
      >
        <img :src="getUtilityIcon(item)" />
      </div>
    </div>
    <div class="sketch-tool__keymaps-bar">
      <div class="sketch-tool__keymap" @click="undo">
        <button class="sketch-tool__key-outer">
          <div class="sketch-tool__key-inner">Z</div>
        </button>
        <div class="sketch-tool__keymap-label">Undo</div>
      </div>
      <div class="sketch-tool__keymap" @click="redo">
        <button class="sketch-tool__key-outer">
          <div class="sketch-tool__key-inner">Y</div>
        </button>
        <div class="sketch-tool__keymap-label">Redo</div>
      </div>
      <div class="sketch-tool__keymap" @click="removeActiveItems">
        <button class="sketch-tool__key-outer">
          <div class="sketch-tool__key-inner">Del</div>
        </button>
        <div class="sketch-tool__keymap-label">Delete objects</div>
      </div>
      <div class="sketch-tool__keymap" @click="clearStage">
        <button class="sketch-tool__key-outer">
          <div class="sketch-tool__key-inner">R</div>
        </button>
        <div class="sketch-tool__keymap-label">Clear board</div>
      </div>
      <div class="sketch-tool__keymap" @click="setResponsiveStageSize()">
        <button class="sketch-tool__key-outer">
          <div class="sketch-tool__key-inner">C</div>
        </button>
        <div class="sketch-tool__keymap-label">Center board</div>
      </div>
      <div class="sketch-tool__keymap" @click="activeTool = ToolTypes.Pan">
        <button class="sketch-tool__key-outer sketch-tool__key-outer--large">
          <div class="sketch-tool__key-inner">Space</div>
        </button>
        <div class="sketch-tool__keymap-label">(Hold) Pan around</div>
      </div>
    </div>
    <div class="sketch-tool__clients">
      <span class="sketch-tool__client" v-for="client in remoteClients" :key="client.id">
        <span class="sketch-tool__client-dot" :style="{ background: client.color }" /> {{ client.userName }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" src="./SketchTool.ts"></script>
<style lang="scss" src="./SketchTool.scss"></style>
