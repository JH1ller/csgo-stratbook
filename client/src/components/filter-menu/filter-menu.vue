<template>
  <div class="filter-menu">
    <div class="filter-menu__container">
      <font-awesome-icon icon="filter" class="filter-menu__icon-filter" />
      <multiselect
        class="filter-menu__filter-player"
        :options="playerOptions"
        :searchable="false"
        :allow-empty="false"
        :show-labels="false"
        placeholder="Player"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./filter-menu.ts"></script>
<style lang="scss" src="./filter-menu.scss"></style>