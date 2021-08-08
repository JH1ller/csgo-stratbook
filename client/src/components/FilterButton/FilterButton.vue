<template>
  <div class="filter-button" @click="click">
    <fa-icon icon="filter" class="filter-button__icon" />
    <span class="filter-button__label">Filter</span>
    <span class="filter-button__indicator" v-if="activeFilterCount">{{ activeFilterCount }}</span>
  </div>
</template>

<script lang="ts" src="./FilterButton.ts"></script>
<style lang="scss" src="./FilterButton.scss"></style>