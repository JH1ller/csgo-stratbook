<template>
  <div class="map-picker">
    <div class="map-picker__container">
      <div
        class="map-picker__map"
        v-for="map in maps"
        :key="map._id"
        @click="mapClicked(map._id)"
        :class="{ '-current': isCurrentMap(map._id) }"
      >
        <img :src="getMapImage(map._id)" alt="Map" class="map-picker__image" draggable="false" />
        <p class="map-picker__label">{{ map.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./MapPicker.ts"></script>
<style lang="scss" src="./MapPicker.scss"></style>