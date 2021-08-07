<template>
  <div class="filter-button">
    <FloatingButton class="filter-button__button" label="Filter" icon="filter" @click="click" />
    <span class="filter-button__indicator" v-if="activeFilterCount">{{ activeFilterCount }}</span>
  </div>
</template>

<script lang="ts" src="./FilterButton.ts"></script>
<style lang="scss" src="./FilterButton.scss"></style>