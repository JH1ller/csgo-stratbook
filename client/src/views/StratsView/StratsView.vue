<template>
  <div class="view-wrapper">
    <map-picker @map-clicked="updateStratMap" :currentMap="stratMap" />
    <filter-menu
      @player-selected="updatePlayerFilter"
      @type-filter-selected="updateTypeFilter"
      @side-filter-selected="updateSideFilter"
      @name-filter-selected="updateNameFilter"
      @clear-filters="clearFilters"
      :teamMembers="teamMembers"
      :filters="filters"
    />
    <strat-list
      @delete-strat="requestDeleteStrat"
      @edit-strat="showCreationOverlay"
      @toggle-active="toggleStratActive"
      @update-content="updateContent"
      @share-strat="requestShareStrat"
      @unshare-strat="unshareStrat"
      :strats="stratsOfCurrentMap"
      :filters="filters"
    />
    <transition name="fade">
      <floating-add @on-click="showCreationOverlay" v-if="stratMap" />
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
