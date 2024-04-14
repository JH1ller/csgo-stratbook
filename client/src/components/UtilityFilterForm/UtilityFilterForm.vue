<template>
  <div class="utility-filter-form">
    <div class="utility-filter-form__filter">
      <label class="utility-filter-form__label" for="name">Utility name</label>
      <input type="text" class="utility-filter-form__input" v-model="nameFilter" />
    </div>
    <div class="utility-filter-form__filter">
      <label class="utility-filter-form__label">Side</label>
      <SidePicker class="utility-filter-form__picker" v-model="sideFilter" />
    </div>
    <div class="utility-filter-form__filter">
      <label class="utility-filter-form__label" for="type">Type</label>
      <UtilityPicker class="utility-filter-form__picker" v-model="typeFilter" />
    </div>
    <div class="utility-filter-form__filter">
      <label class="utility-filter-form__label" for="name">Labels</label>
      <div class="utility-filter-form__label-tag-list">
        <div
          class="utility-filter-form__label-tag"
          v-for="label in allLabels"
          :key="label"
          :class="{ '-active': isLabelActive(label) }"
          @click="() => labelClicked(label)"
        >
          {{ label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./UtilityFilterForm.ts"></script>
<style lang="scss" src="./UtilityFilterForm.scss"></style>
