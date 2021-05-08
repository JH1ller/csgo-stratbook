<template>
  <div class="strats-view">
    <transition name="fade">
      <MapPicker v-show="!gameMode" @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    </transition>
    <FilterMenu :open="filterMenuOpen" @close="filterMenuOpen = false" @clear-filters="clearStratFilters">
      <StratFilterForm
        @content-filter-change="updateStratContentFilter"
        @type-filter-change="updateStratTypeFilter"
        @side-filter-change="updateStratSideFilter"
        @name-filter-change="updateStratNameFilter"
        :filters="stratFilters"
      />
    </FilterMenu>
    <StratList
      class="strats-view__strat-list"
      :class="{ '-game-mode': gameMode }"
      @delete-strat="requestDeleteStrat"
      @edit-strat="showStratForm"
      @toggle-active="toggleStratActive"
      @update-content="updateContent"
      @share-strat="requestShareStrat"
      @unshare-strat="unshareStrat"
      @show-map="showDrawTool"
      @toggle-collapse="toggleStratCollapse"
      @edit-changed="updateEdited"
      @editor-focussed="hasEditorFocus = true"
      @editor-blurred="hasEditorFocus = false"
      :completedTutorial="profile.completedTutorial"
      :tutorialStrat="tutorialStrat"
      :strats="sortedFilteredStratsOfCurrentMap"
      :collapsedStrats="collapsedStrats"
      :editedStrats="editedStrats"
    />
    <transition name="fade">
      <div class="strats-view__fab-group" v-if="!filterMenuOpen && !stratFormOpen">
        <FloatingButton
          class="strats-view__floating-game-mode"
          label="Focus Mode"
          icon="crosshairs"
          @click="toggleGameMode"
        />
        <FloatingButton
          class="strats-view__floating-collapse"
          icon="compress-alt"
          label="Collapse All"
          @click="collapseAll"
        />
        <FloatingButton
          class="strats-view__floating-collapse"
          icon="expand-alt"
          label="Expand All"
          @click="expandAll"
        />
        <FilterButton
          class="strats-view__filter-button"
          @click="filterMenuOpen = true"
          :activeFilterCount="activeStratFilterCount"
        />
        <transition name="fade">
          <FloatingButton
            v-if="!gameMode"
            class="strats-view__floating-add"
            label="Add Strat"
            icon="plus"
            @click="showStratForm"
          />
        </transition>
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
        @close="hideStratForm"
      />
    </transition>
    <transition name="fade">
      <DrawTool v-if="drawToolOpen" @close="drawToolOpen = false" @save="updateStrat" :strat="currentDrawToolStrat" />
    </transition>
  </div>
</template>

<script lang="ts" src="./StratsView.ts"></script>
<style lang="scss" src="./StratsView.scss"></style>
