<template>
  <div class="component">
    <div class="map-picker">
      <p class="map-picker__label" v-for="(map) in maps" :key="map.name">{{map.name}}</p>
    </div>
  </div>
</template>

<script lang="ts" src="./map-picker.ts"></script>
<style lang="scss" src="./map-picker.scss"></style>