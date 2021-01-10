<template>
  <div class="utility-view">
    <map-picker @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    <UtilityList :filters="utilityFilters" :utilities="sortedUtilitiesOfCurrentMap" @open-in-lightbox="showLightbox" />
    <FilterMenu :open="filterMenuOpen" @close="toggleFilterMenu" @clear-filters="clearUtilityFilters">
      <UtilityFilterForm
        @type-filter-change="updateUtilityTypeFilter"
        @side-filter-change="updateUtilitySideFilter"
        @name-filter-change="updateUtilityNameFilter"
        :filters="utilityFilters"
      />
    </FilterMenu>
    <transition name="fade">
      <div class="utility-view__fab-group" v-if="!filterMenuOpen && !utilityFormOpen">
        <FilterButton
          class="utility-view__filter-button"
          @click="toggleFilterMenu"
          :activeFilterCount="activeUtilityFilterCount"
        />
        <FloatingAdd class="utility-view__floating-add" label="Add utility" @click="showUtilityForm" />
      </div>
    </transition>
    <transition name="fade">
      <UtilityLightbox v-if="lightboxOpen" :utility="currentLightboxUtility" @close="hideLightbox" />
    </transition>

    <transition name="fade">
      <UtilityForm
        v-if="utilityFormOpen"
        :isEdit="utilityFormEditMode"
        :utility="editUtility"
        @submit-utility="utilityFormSubmitted"
        @cancel-clicked="hideUtilityForm"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./UtilityView.ts"></script>
<style lang="scss" src="./UtilityView.scss"></style>
