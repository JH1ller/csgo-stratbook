<template>
  <div class="component">
    <div class="strat-list">
      <div class="strat-list__map-container">
        <!-- <div
          class="strat-list__map-wrapper"
          v-for="(map) in maps"
          :key="map.name"
          @click="mapClicked(map._id)"
        >
          <img :src="map.image" alt class="strat-list__map-image" draggable="false" />
          <p class="strat-list__map-label">{{ map.name }}</p>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./strat-list.ts"></script>
<style lang="scss" src="./strat-list.scss"></style>