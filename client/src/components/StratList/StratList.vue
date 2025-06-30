<template>
  <SlickList
    class="strat-list"
    lockAxis="y"
    @input="handleSortChange"
    :value="strats"
    tag="div"
    :lockToContainerEdges="true"
    :useDragHandle="true"
  >
    <SlickItem v-for="(strat, index) in strats" :key="index" :index="index" tag="div">
      <strat-item
        :strat="strat"
        :completedTutorial="completedTutorial"
        :isTutorial="tutorialStrat && strat._id === tutorialStrat._id"
        :collapsed="isCollapsed(strat)"
        :editMode="isEdited(strat)"
        :readOnly="readOnly"
        :key="strat._id"
        ref="stratItemComponents"
        @delete-strat="deleteStrat"
        @toggle-active="updateStrat"
        @edit-strat="editStrat"
        @update-content="updateStrat"
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
    </SlickItem>
  </SlickList>
</template>

<script lang="ts" src="./StratList.ts"></script>
<style lang="scss" src="./StratList.scss"></style>
