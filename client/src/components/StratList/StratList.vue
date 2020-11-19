<template>
  <transition-group name="fade" tag="div" class="strat-list" mode="out-in">
    <strat-item
      v-for="strat in filteredStrats"
      :key="strat._id"
      :strat="strat"
      @delete-strat="deleteStrat"
      @toggle-active="toggleActive"
      @edit-strat="editStrat"
      @update-content="updateContent"
    />
  </transition-group>
</template>

<script lang="ts" src="./StratList.ts"></script>
<style lang="scss" src="./StratList.scss"></style>