<template>
  <div class="utility-filter-form">
    <label class="utility-filter-form__label" for="name">Utility name</label>
    <input type="text" class="utility-filter-form__input" v-model="nameFilter" />
    <label class="utility-filter-form__label">Side</label>
    <SidePicker class="utility-filter-form__picker" v-model="sideFilter" />
    <label class="utility-filter-form__label" for="type">Type</label>
    <UtilityPicker class="utility-filter-form__picker" v-model="typeFilter" />
  </div>
</template>

<script lang="ts" src="./UtilityFilterForm.ts"></script>
<style lang="scss" src="./UtilityFilterForm.scss"></style>