<template>
  <div class="map-picker">
    <div class="map-picker__container">
      <div
        class="map-picker__map"
        v-for="[id, label] in Object.entries(maps)"
        :key="id"
        @click="mapClicked(id)"
        :class="{ '-current': isCurrentMap(id) }"
      >
        <SmartImage :src="getMapImage(id)" alt="Map" class="map-picker__image" />
        <p class="map-picker__label">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./MapPicker.ts"></script>
<style lang="scss" src="./MapPicker.scss"></style>
