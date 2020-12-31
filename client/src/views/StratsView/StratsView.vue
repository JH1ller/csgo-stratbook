<template>
  <div class="strats-view">
    <MapPicker @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    <FilterMenu :open="filterMenuOpen" @close="toggleFilterMenu" @clear-filters="clearStratFilters">
      <StratFilterForm
        @content-filter-change="updateStratContentFilter"
        @type-filter-change="updateStratTypeFilter"
        @side-filter-change="updateStratSideFilter"
        @name-filter-change="updateStratNameFilter"
        :filters="stratFilters"
      />
    </FilterMenu>
    <StratList
      @delete-strat="requestDeleteStrat"
      @edit-strat="showStratForm"
      @toggle-active="toggleStratActive"
      @update-content="updateContent"
      @share-strat="requestShareStrat"
      @unshare-strat="unshareStrat"
      :strats="sortedStrats"
      :filters="stratFilters"
    />
    <transition name="fade">
      <FloatingAdd class="strats-view__floating-add" @click="showStratForm" v-if="!filterMenuOpen && !stratFormOpen" />
    </transition>

    <transition name="fade">
      <FilterButton
        class="strats-view__filter-button"
        @click="toggleFilterMenu"
        v-if="!filterMenuOpen && !stratFormOpen"
        :activeFilterCount="activeStratFilterCount"
      />
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
