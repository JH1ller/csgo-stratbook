<template>
  <div class="strats-view">
    <MapPicker @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    <FilterMenu
      @content-filter-change="updateContentFilter"
      @type-filter-change="updateTypeFilter"
      @side-filter-change="updateSideFilter"
      @name-filter-change="updateNameFilter"
      @clear-filters="clearFilters"
      @close="toggleFilterMenu"
      :filters="filterStateObject"
      :open="filterMenuOpen"
    />
    <StratList
      @delete-strat="requestDeleteStrat"
      @edit-strat="showStratForm"
      @toggle-active="toggleStratActive"
      @update-content="updateContent"
      @share-strat="requestShareStrat"
      @unshare-strat="unshareStrat"
      :strats="sortedStrats"
      :filters="filterStateObject"
    />
    <transition name="fade">
      <FloatingAdd class="strats-view__floating-add" @click="showStratForm" v-if="!stratFormOpen" />
    </transition>

    <transition name="fade">
      <FilterButton class="strats-view__filter-button" @click="toggleFilterMenu" v-if="!filterMenuOpen" />
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
