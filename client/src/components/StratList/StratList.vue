<template>
  <div class="strat-list">
    <strat-item
      v-for="(strat, index) in strats"
      :key="strat._id"
      :strat="strat"
      :completedTutorial="completedTutorial"
      :isTutorial="strat._id === (tutorialStrat && tutorialStrat._id)"
      :collapsed="isCollapsed(strat)"
      :editMode="isEdited(strat)"
      :gameMode="gameMode"
      @delete-strat="deleteStrat"
      @toggle-active="toggleActive"
      @edit-strat="editStrat"
      @update-content="updateContent"
      @share-strat="shareStrat"
      @unshare-strat="unshareStrat"
      @toggle-collapse="toggleCollapse"
      @edit-changed="editChanged"
      @show-map="showMap(strat)"
      @editor-focussed="editorFocussed"
      @editor-blurred="editorBlurred"
      @filter-type="filterType"
      @filter-side="filterSide"
      :style="{ 'animation-delay': 0.05 * index + 's' }"
    />
  </div>
</template>

<script lang="ts" src="./StratList.ts"></script>
<style lang="scss" src="./StratList.scss"></style>