<template>
  <div class="smart-image" :class="state">
    <img :src="src" :alt="alt" @load="load" @error="error" class="smart-image__img" draggable="false" />
    <Loader class="smart-image__loader" />
    <fa-icon icon="exclamation-triangle" class="smart-image__error" />
  </div>
</template>

<script lang="ts" src="./SmartImage.ts"></script>
<style lang="scss" src="./SmartImage.scss"></style>