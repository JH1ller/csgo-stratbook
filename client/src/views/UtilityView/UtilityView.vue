<template>
  <div class="utility-view">
    <map-picker @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    <UtilityList
      :utilities="sortedFilteredUtilitiesOfCurrentMap"
      @open-in-lightbox="showLightbox"
      @edit-utility="showUtilityForm"
      @delete-utility="requestDeleteUtility"
      @share-utility="requestShareUtility"
      @unshare="unshareUtility"
    />
    <FilterMenu :open="filterMenuOpen" @close="filterMenuOpen = false" @clear-filters="clearUtilityFilters">
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
          @click="filterMenuOpen = true"
          :activeFilterCount="activeUtilityFilterCount"
          v-tippy
          content="CTRL+Shift+F"
        />
        <FloatingButton
          class="utility-view__floating-add"
          label="Add utility"
          icon="plus"
          @click="showUtilityForm"
          v-tippy
          content="CTRL+A"
        />
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
        @close="hideUtilityForm"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./UtilityView.ts"></script>
<style lang="scss" src="./UtilityView.scss"></style>
