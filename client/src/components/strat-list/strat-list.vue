<template>
  <transition-group name="fade" tag="div" class="strat-list" mode="out-in">
    <strat-item
      v-for="strat in filteredStrats"
      :key="strat._id"
      :strat="strat"
      @delete-strat="deleteStrat"
      @toggle-active="toggleActive"
      @update-step="updateStep"
      @edit-strat="editStrat"
      @add-step="addStep"
      @delete-step="deleteStep"
    />
  </transition-group>
</template>

<script lang="ts" src="./strat-list.ts"></script>
<style lang="scss" src="./strat-list.scss"></style>