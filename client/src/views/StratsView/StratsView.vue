<template>
  <div class="view-wrapper">
    <map-picker @map-clicked="updateCurrentMap" />
    <strat-list
      @delete-clicked="deleteStrat"
      @toggle-active="toggleStratActive"
      @update-step="updateStep"
    />
    <transition name="fade">
      <floating-add @on-click="showCreationOverlay" v-if="currentMap" />
    </transition>
    <transition name="fade">
      <creation-overlay
        v-if="creationOverlayOpen"
        :isEdit="creationOverlayEditMode"
        @submit-clicked="creationOverlaySubmitted"
        @cancel-clicked="hideCreationOverlay"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./StratsView.ts"></script>
<style lang="scss" src="./StratsView.scss"></style>
