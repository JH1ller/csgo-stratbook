<template>
  <div class="backdrop-dialog">
    <div class="backdrop-dialog__content" :class="{ '-fullscreen': fullscreen }">
      <slot />
    </div>
    <button v-if="fullscreen" class="backdrop-dialog__close-btn"><fa-icon icon="close" /></button>
  </div>
</template>

<script lang="ts" src="./BackdropDialog.ts"></script>
<style lang="scss" src="./BackdropDialog.scss"></style>
