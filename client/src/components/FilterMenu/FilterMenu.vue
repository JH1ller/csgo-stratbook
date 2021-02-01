<template>
  <div class="filter-menu" :class="{ '-open': open }">
    <h2 class="filter-menu__title">Filters</h2>
    <slot />
    <button class="filter-menu__btn --clear" @click="clearFilters"><fa-icon icon="ban" />Clear filters</button>
    <button class="filter-menu__btn --close" @click="close"><fa-icon icon="times" />Close filters</button>
  </div>
</template>

<script lang="ts" src="./FilterMenu.ts"></script>
<style lang="scss" src="./FilterMenu.scss"></style>