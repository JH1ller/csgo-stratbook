<template>
  <div class="map-picker">
    <div class="map-picker__map-container">
      <div
        class="map-picker__map-wrapper"
        v-for="(map) in maps"
        :key="map.name"
        @click="mapClicked(map._id)"
        :class="{'-current': isCurrentMap(map._id)}"
      >
        <img :src="map.image" alt class="map-picker__map-image" draggable="false" />
        <p class="map-picker__map-label">{{ map.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./MapPicker.ts"></script>
<style lang="scss" src="./MapPicker.scss"></style>