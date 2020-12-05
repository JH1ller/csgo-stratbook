<template>
  <div class="filter-menu" :class="{ '-open': open }">
    <h2 class="filter-menu__title">Filters</h2>
    <label class="filter-menu__label" for="name">Strat name</label>
    <input type="text" class="filter-menu__input" v-model="nameFilter" />
    <label class="filter-menu__label">Side</label>
    <SidePicker class="filter-menu__picker" v-model="sideFilter" />
    <label class="filter-menu__label" for="type">Type</label>
    <TypePicker class="filter-menu__picker" v-model="typeFilter" />
    <label class="filter-menu__label" for="name">Strat content</label>
    <input type="text" class="filter-menu__input" v-model="contentFilter" />
    <button class="filter-menu__btn --clear" @click="clearFilters">Clear filters<fa-icon icon="ban" /></button>
    <button class="filter-menu__btn --close" @click="close">Close filters<fa-icon icon="times" /></button>
  </div>
</template>

<script lang="ts" src="./FilterMenu.ts"></script>
<style lang="scss" src="./FilterMenu.scss"></style>