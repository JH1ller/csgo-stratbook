<template>
  <div class="strats-view">
    <MapPicker @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    <FilterMenu
      @player-selected="updatePlayerFilter"
      @type-filter-selected="updateTypeFilter"
      @side-filter-selected="updateSideFilter"
      @name-filter-selected="updateNameFilter"
      @clear-filters="clearFilters"
      :teamMembers="teamMembers"
      :filters="filters"
    />
    <StratList
      @delete-strat="requestDeleteStrat"
      @edit-strat="showStratForm"
      @toggle-active="toggleStratActive"
      @update-content="updateContent"
      @share-strat="requestShareStrat"
      @unshare-strat="unshareStrat"
      :strats="sortedStrats"
      :filters="filters"
    />
    <transition name="fade">
      <FloatingAdd @on-click="showStratForm" v-if="!stratFormOpen" />
    </transition>
    <transition name="fade">
      <UtilityLightbox v-if="lightboxOpen" :utility="currentLightboxUtility" @close="hideLightbox" />
    </transition>
    <transition name="fade">
      <StratForm
        v-if="stratFormOpen"
        :isEdit="stratFormEditMode"
        :strat="editStrat"
        @submit-strat="stratFormSubmitted"
        @cancel-clicked="hideStratForm"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./StratsView.ts"></script>
<style lang="scss" src="./StratsView.scss"></style>
