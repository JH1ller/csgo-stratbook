<template>
  <div class="component">
    <div class="strat-item">
      <div class="strat-item__map-container">
        <!-- <div
          class="strat-item__map-wrapper"
          v-for="(map) in maps"
          :key="map.name"
          @click="mapClicked(map._id)"
        >
          <img :src="map.image" alt class="strat-item__map-image" draggable="false" />
          <p class="strat-item__map-label">{{ map.name }}</p>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./strat-item.ts"></script>
<style lang="scss" src="./strat-item.scss"></style>