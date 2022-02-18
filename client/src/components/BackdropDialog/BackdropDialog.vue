<template>
  <div class="backdrop-dialog">
    <div class="backdrop-dialog__content" :class="{ '-fullscreen': fullscreen }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" src="./BackdropDialog.ts"></script>
<style lang="scss" src="./BackdropDialog.scss"></style>
