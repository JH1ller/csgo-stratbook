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
      :strats="sortedStratsOfCurrentMap"
      :filters="stratFilters"
    />
    <transition name="fade">
      <div class="strats-view__fab-group" v-if="!filterMenuOpen && !stratFormOpen">
        <FilterButton
          class="strats-view__filter-button"
          @click="toggleFilterMenu"
          :activeFilterCount="activeStratFilterCount"
        />
        <FloatingAdd class="strats-view__floating-add" @click="showStratForm" />
      </div>
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
