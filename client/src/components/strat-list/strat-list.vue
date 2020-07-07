<template>
  <div class="strat-list">
    <div class="strat-list__map-container">
      <transition-group name="fade">
        <strat-item
          v-for="strat in filteredStrats"
          :key="strat._id"
          :strat="strat"
          @delete-clicked="deleteClicked"
          @toggle-active="toggleActive"
          @update-step="updateStep"
          @edit-strat="editStrat"
          @add-step="addStep"
          @delete-step="deleteStep"
        />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" src="./strat-list.ts"></script>
<style lang="scss" src="./strat-list.scss"></style>