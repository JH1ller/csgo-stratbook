<template>
  <div class="map-view">
    <SketchTool :map="'DUST_2'" :name="name" @connect="showConnectionDialog = true" />
    <ConnectionDialog v-if="showConnectionDialog" />
  </div>
</template>

<script lang="ts" src="./MapView.ts"></script>
<style lang="scss" src="./MapView.scss"></style>
