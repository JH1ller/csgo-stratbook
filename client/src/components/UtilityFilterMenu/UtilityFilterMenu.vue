<template>
  <div class="utility-filter-menu" :class="{ '-open': open }">
    <h2 class="utility-filter-menu__title">Filters</h2>
    <label class="utility-filter-menu__label" for="name">Utility name</label>
    <input type="text" class="utility-filter-menu__input" v-model="nameFilter" />
    <label class="utility-filter-menu__label">Side</label>
    <SidePicker class="utility-filter-menu__picker" v-model="sideFilter" />
    <label class="utility-filter-menu__label" for="type">Type</label>
    <UtilityPicker class="utility-filter-menu__picker" v-model="typeFilter" />
    <button class="utility-filter-menu__btn --clear" @click="clearFilters">Clear filters<fa-icon icon="ban" /></button>
    <button class="utility-filter-menu__btn --close" @click="close">Close filters<fa-icon icon="times" /></button>
  </div>
</template>

<script lang="ts" src="./UtilityFilterMenu.ts"></script>
<style lang="scss" src="./UtilityFilterMenu.scss"></style>