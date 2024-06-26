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
        @touchstart.passive="handleMouseDown"
        @mousemove="handleMouseMove"
        @touchmove.passive="handleMouseMove"
        @mouseup="handleMouseUp"
        @touchup.passive="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @wheel="handleZoom"
      >
        <!-- Background layer without events -->
        <v-layer :config="{ listening: false }">
          <v-rect :config="backgroundRectConfig" v-once />
          <v-image :config="backgroundConfig" />
        </v-layer>
        <!-- Main content layer -->
        <v-layer>
          <v-image v-for="item in itemState.images" :key="item.id" :config="getImageItemConfig(item)" />
          <v-line v-for="item in itemState.lines" :key="item.id" :config="getLineItemConfig(item)" />
          <v-text
            v-for="item in itemState.texts"
            :key="item.id"
            :config="getTextItemConfig(item)"
            @dblclick="handleTextDblClick"
          />
          <v-image v-for="item in itemState.players" :key="item.id" :config="getPlayerItemConfig(item)" />
          <v-text v-for="item in itemState.players" :key="item.id + 'text'" :config="getPlayerTextItemConfig(item)" />
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
        :swatches="swatches"
        shapes="circles"
        swatch-size="30"
        popover-y="top"
        popover-x="right"
        @input="handleColorChange"
      ></v-swatches>
      <button
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Pointer }"
        @click="setActiveTool(ToolTypes.Pointer)"
        v-tippy
        content="Pointer (V)"
      >
        <fa-icon icon="mouse-pointer" /><span class="sketch-tool__btn-label">Pointer</span>
      </button>
      <button
        v-if="!readOnly"
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Brush }"
        @click="setActiveTool(ToolTypes.Brush)"
        v-tippy
        content="Brush (B)"
      >
        <fa-icon icon="pencil-alt" /><span class="sketch-tool__btn-label">Draw</span>
      </button>
      <button
        v-if="!readOnly"
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Pan }"
        @click="setActiveTool(ToolTypes.Pan)"
        v-tippy
        content="Pan (Space)"
      >
        <fa-icon icon="arrows-alt" /><span class="sketch-tool__btn-label">Pan</span>
      </button>
      <button
        v-if="!readOnly"
        class="sketch-tool__btn"
        :class="{ '-active': activeTool === ToolTypes.Text }"
        @click="setActiveTool(ToolTypes.Text)"
        v-tippy
        content="Text (T)"
      >
        <fa-icon icon="i-cursor" /><span class="sketch-tool__btn-label">Text</span>
      </button>
      <button class="sketch-tool__btn" @click="saveToFile" v-tippy content="Save to file">
        <fa-icon icon="download" /><span class="sketch-tool__btn-label">Save to file</span>
      </button>
      <button
        v-if="!roomId && isMapView"
        class="sketch-tool__btn"
        @click="() => connect()"
        v-tippy
        content="Create room"
      >
        <fa-icon icon="network-wired" /><span class="sketch-tool__btn-label">Create room</span>
      </button>
      <button v-if="roomId && isMapView" class="sketch-tool__btn" @click="copyRoomLink" v-tippy content="Copy link">
        <fa-icon icon="copy" /><span class="sketch-tool__btn-label">Copy link</span>
      </button>
      <button v-if="roomId && isMapView" class="sketch-tool__btn" @click="leaveRoom" v-tippy content="Leave room">
        <fa-icon icon="sign-out-alt" /><span class="sketch-tool__btn-label">Leave room</span>
      </button>
      <button
        v-if="isMapView && roomId"
        class="sketch-tool__btn"
        @click="showConnectionDialog"
        v-tippy
        content="Connection"
      >
        <fa-icon icon="cog" /><span class="sketch-tool__btn-label">Settings</span>
      </button>
    </div>
    <div v-if="!readOnly" class="sketch-tool__draggables-bar">
      <div
        class="sketch-tool__draggable -anim"
        :data-type="item.toLowerCase()"
        v-for="item in UtilityTypes"
        :key="item"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @animationend="(e) => e.target.classList.remove('-anim')"
      >
        <svg-icon :name="item.toLowerCase()" />
      </div>
      <div
        class="sketch-tool__draggable"
        data-type="player"
        draggable="true"
        @dragstart="handleDragStart($event, 'PLAYER')"
      >
        <svg-icon name="player" />
      </div>
    </div>
    <div class="sketch-tool__left-container">
      <div class="sketch-tool__keymaps-bar">
        <div v-if="!readOnly" class="sketch-tool__keymap" @click="undo">
          <button class="sketch-tool__key-outer">
            <div class="sketch-tool__key-inner">Z</div>
          </button>
          <div class="sketch-tool__keymap-label">Undo</div>
        </div>
        <div v-if="!readOnly" class="sketch-tool__keymap" @click="redo">
          <button class="sketch-tool__key-outer">
            <div class="sketch-tool__key-inner">Y</div>
          </button>
          <div class="sketch-tool__keymap-label">Redo</div>
        </div>
        <div v-if="!readOnly" class="sketch-tool__keymap" @click="removeActiveItems">
          <button class="sketch-tool__key-outer">
            <div class="sketch-tool__key-inner">Del</div>
          </button>
          <div class="sketch-tool__keymap-label">Delete objects</div>
        </div>
        <div v-if="!readOnly" class="sketch-tool__keymap" @click="clearStage">
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
        <div class="sketch-tool__keymap" @click="setActiveTool(ToolTypes.Pan)">
          <button class="sketch-tool__key-outer sketch-tool__key-outer--large">
            <div class="sketch-tool__key-inner">Space</div>
          </button>
          <div class="sketch-tool__keymap-label">(Hold) Pan around</div>
        </div>
      </div>
      <div class="sketch-tool__clients-headline">Connected players</div>
      <transition-group name="fade" tag="div" class="sketch-tool__clients">
        <span class="sketch-tool__client" v-for="client in remoteClients" :key="client.id">
          <span class="sketch-tool__client-dot" :style="{ background: client.color }" /> {{ client.userName }}
        </span>
      </transition-group>
    </div>
    <vue-context ref="playerPicker" v-slot="{ data }" @close="rejectPlayerPicker">
      <li v-for="player in teamMembers" :key="player._id">
        <a @click="() => data.callback(player)">
          {{ player.name }}
        </a>
      </li>
      <li key="default">
        <a @click="() => data.callback()">
          <span class="sketch-tool__context-dot" :style="`--color: ${currentColor}`" /> Selected color
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script lang="ts" src="./SketchTool.ts"></script>
<style lang="scss" src="./SketchTool.scss"></style>
