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
        @inactive-filter-change="updateStratInactiveFilter"
        :filters="stratFilters"
      />
    </FilterMenu>
    <StratList
      class="strats-view__strat-list"
      ref="stratList"
      :class="{ '-game-mode': gameMode }"
      :completedTutorial="profile.completedTutorial"
      :tutorialStrat="tutorialStrat"
      :strats="sortedFilteredStratsOfCurrentMap"
      :collapsedStrats="collapsedStrats"
      :editedStrats="editedStrats"
      :gameMode="gameMode"
      @delete-strat="requestDeleteStrat"
      @edit-strat="showStratForm"
      @update-strat="updateStrat"
      @share-strat="requestShareStrat"
      @unshare-strat="unshareStrat"
      @show-map="showDrawTool"
      @toggle-collapse="toggleStratCollapse"
      @edit-changed="updateEdited"
      @editor-focussed="hasEditorFocus = true"
      @editor-blurred="hasEditorFocus = false"
      @filter-type="applyStratTypeFilter"
      @filter-side="updateStratSideFilter"
    />
    <transition name="fade">
      <div class="strats-view__fab-group" v-if="!filterMenuOpen && !stratFormOpen">
        <FloatingButton
          class="strats-view__floating-game-mode"
          label="Focus Mode"
          icon="crosshairs"
          @click="toggleGameMode"
          v-tippy
          content="CTRL+G"
        />
        <FloatingButton
          class="strats-view__floating-sort"
          :icon="sortBtnIcon"
          label="Sort"
          @click="toggleSort"
          v-tippy
          content="CTRL+S"
        />
        <FloatingButton
          class="strats-view__floating-collapse"
          icon="compress-alt"
          label="Collapse All"
          @click="collapseAll"
          v-tippy
          content="CTRL+E"
        />
        <FloatingButton
          class="strats-view__floating-collapse"
          icon="expand-alt"
          label="Expand All"
          @click="expandAll"
          v-tippy
          content="CTRL+Shift+E"
        />
        <FilterButton
          class="strats-view__filter-button"
          @click="filterMenuOpen = true"
          :activeFilterCount="activeStratFilterCount"
          v-tippy
          content="CTRL+Shift+F"
        />
        <transition name="fade">
          <FloatingButton
            v-if="!gameMode"
            class="strats-view__floating-add"
            label="Add Strat"
            icon="plus"
            @click="showStratForm"
            v-tippy
            content="CTRL+Shift+A"
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
      <BackdropDialog :fullscreen="true" v-if="drawToolOpen && currentDrawToolStrat" @close="closeDrawTool">
        <SketchTool
          :stratName="currentDrawToolStrat.name"
          :userName="profile.name"
          :roomId="currentDrawToolStrat._id.slice(0, 10)"
          :stratId="currentDrawToolStrat._id"
          :map="currentMap"
          :isMapView="false"
        />
      </BackdropDialog>
    </transition>
  </div>
</template>

<script lang="ts" src="./StratsView.ts"></script>
<style lang="scss" src="./StratsView.scss"></style>
