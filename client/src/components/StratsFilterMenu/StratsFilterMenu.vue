<template>
  <div class="strats-filter-menu" :class="{ '-open': open }">
    <h2 class="strats-filter-menu__title">Filters</h2>
    <label class="strats-filter-menu__label" for="name">Strat name</label>
    <input type="text" class="strats-filter-menu__input" v-model="nameFilter" />
    <label class="strats-filter-menu__label">Side</label>
    <SidePicker class="strats-filter-menu__picker" v-model="sideFilter" />
    <label class="strats-filter-menu__label" for="type">Type</label>
    <TypePicker class="strats-filter-menu__picker" v-model="typeFilter" />
    <label class="strats-filter-menu__label" for="name">Strat content</label>
    <input type="text" class="strats-filter-menu__input" v-model="contentFilter" />
    <button class="strats-filter-menu__btn --clear" @click="clearFilters">Clear filters<fa-icon icon="ban" /></button>
    <button class="strats-filter-menu__btn --close" @click="close">Close filters<fa-icon icon="times" /></button>
  </div>
</template>

<script lang="ts" src="./StratsFilterMenu.ts"></script>
<style lang="scss" src="./StratsFilterMenu.scss"></style>