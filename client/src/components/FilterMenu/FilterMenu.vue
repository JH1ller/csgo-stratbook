<template>
  <div class="filter-menu" :class="{ '-open': open }">
    <h2 class="filter-menu__title">Filters</h2>
    <slot />
    <button class="filter-menu__btn --clear" @click="clearFilters">Clear filters<fa-icon icon="ban" /></button>
    <button class="filter-menu__btn --close" @click="close">Close filters<fa-icon icon="times" /></button>
  </div>
</template>

<script lang="ts" src="./FilterMenu.ts"></script>
<style lang="scss" src="./FilterMenu.scss"></style>