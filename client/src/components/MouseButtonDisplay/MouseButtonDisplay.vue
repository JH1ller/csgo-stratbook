<template>
  <div class="mouse-button-display">
    <img src="~@/assets/icons/mouse-short.png" class="mouse-button-display__image" />
    <img
      src="~@/assets/icons/mouse-left-short.png"
      v-if="mouseButtons === MouseButtons.LEFT || mouseButtons === MouseButtons.LEFTRIGHT"
      class="mouse-button-display__image"
    />
    <img
      src="~@/assets/icons/mouse-right-short.png"
      v-if="mouseButtons === MouseButtons.RIGHT || mouseButtons === MouseButtons.LEFTRIGHT"
      class="mouse-button-display__image"
    />
  </div>
</template>

<script lang="ts" src="./MouseButtonDisplay.ts"></script>
<style lang="scss" src="./MouseButtonDisplay.scss"></style>