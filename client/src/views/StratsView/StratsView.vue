<template>
  <div class="view-wrapper">
    <map-picker @map-clicked="updateCurrentMap" />
    <filter-menu
      @player-selected="updatePlayerFilter"
      @type-filter-selected="updateTypeFilter"
      @side-filter-selected="updateSideFilter"
      @name-filter-selected="updateNameFilter"
    />
    <strat-list
      @delete-clicked="deleteStrat"
      @edit-strat="showCreationOverlay"
      @toggle-active="toggleStratActive"
      @update-step="updateStep"
      @add-step="addStep"
      @delete-step="deleteStep"
    />
    <transition name="fade">
      <floating-add @on-click="showCreationOverlay" v-if="currentMap" />
    </transition>
    <transition name="fade">
      <creation-overlay
        v-if="creationOverlayOpen"
        :isEdit="creationOverlayEditMode"
        :strat="editStrat"
        @submit-clicked="creationOverlaySubmitted"
        @cancel-clicked="hideCreationOverlay"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./StratsView.ts"></script>
<style lang="scss" src="./StratsView.scss"></style>
