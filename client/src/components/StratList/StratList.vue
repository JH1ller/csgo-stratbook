<template>
  <div class="strat-list">
    <strat-item
      v-for="(strat, index) in filteredStrats"
      :key="strat._id"
      :strat="strat"
      @delete-strat="deleteStrat"
      @toggle-active="toggleActive"
      @edit-strat="editStrat"
      @update-content="updateContent"
      @share-strat="shareStrat"
      @unshare-strat="unshareStrat"
      :style="{'animation-delay': 0.1 * index + 's'}"
    />
  </div>
</template>

<script lang="ts" src="./StratList.ts"></script>
<style lang="scss" src="./StratList.scss"></style>