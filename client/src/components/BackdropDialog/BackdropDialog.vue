<template>
  <portal to="root">
    <div class="backdrop-dialog">
      <div class="backdrop-dialog__content" :class="{ '-fullscreen': fullscreen }">
        <slot />
        <fa-icon v-if="fullscreen" icon="times" class="backdrop-dialog__close-btn" @click="close" />
      </div>
    </div>
  </portal>
</template>

<script lang="ts" src="./BackdropDialog.ts"></script>
<style lang="scss" src="./BackdropDialog.scss"></style>
