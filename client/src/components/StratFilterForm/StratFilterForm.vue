<template>
  <div class="strat-filter-form">
    <div class="strat-filter-form__filter">
      <label class="strat-filter-form__label" for="name">Strat name</label>
      <input type="text" class="strat-filter-form__input" v-model="nameFilter" />
    </div>
    <div class="strat-filter-form__filter">
      <label class="strat-filter-form__label">Side</label>
      <SidePicker class="strat-filter-form__picker" v-model="sideFilter" />
    </div>
    <div class="strat-filter-form__filter">
      <label class="strat-filter-form__label" for="type">Type</label>
      <TypePicker class="strats-filter-form__picker" v-model="typeFilters" :allowNone="true" />
    </div>
    <div class="strat-filter-form__filter">
      <label class="strat-filter-form__label" for="name">Strat content</label>
      <input type="text" class="strat-filter-form__input" v-model="contentFilter" />
    </div>
    <Checkbox
      class="strat-filter-form__checkbox"
      name="inactiveToggle"
      v-model="inactiveFilter"
      label="hide inactive strats"
    />
    <div class="strat-filter-form__filter">
      <label class="strat-filter-form__label" for="name">Labels</label>
      <div class="strat-filter-form__label-tag-list">
        <div
          class="strat-filter-form__label-tag"
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

<script lang="ts" src="./StratFilterForm.ts"></script>
<style lang="scss" src="./StratFilterForm.scss"></style>
