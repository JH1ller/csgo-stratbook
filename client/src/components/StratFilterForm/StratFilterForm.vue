<template>
  <div class="strat-filter-form">
    <label class="strat-filter-form__label" for="name">Strat name</label>
    <input type="text" class="strat-filter-form__input" v-model="nameFilter" />
    <label class="strat-filter-form__label">Side</label>
    <SidePicker class="strat-filter-form__picker" v-model="sideFilter" />
    <label class="strat-filter-form__label" for="type">Type</label>
    <TypePicker class="strats-filter-form__picker" v-model="typeFilters" :allowNone="true" />
    <label class="strat-filter-form__label" for="name">Strat content</label>
    <input type="text" class="strat-filter-form__input" v-model="contentFilter" />
  </div>
</template>

<script lang="ts" src="./StratFilterForm.ts"></script>
<style lang="scss" src="./StratFilterForm.scss"></style>