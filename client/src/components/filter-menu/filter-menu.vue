<template>
  <div class="filter-menu">
    <div class="filter-menu__container">
      <font-awesome-icon icon="filter" class="filter-menu__icon-filter" />
      <fieldset class="filter-menu__fieldset">
        <label class="filter-menu__label" for="name">Strat name</label>
        <input type="text" class="filter-menu__input" v-model="nameFilterValue" />
      </fieldset>
      <fieldset class="filter-menu__fieldset">
        <label class="filter-menu__label">Side</label>
        <div class="filter-menu__side-wrapper">
          <img
            src="@/assets/icons/t_badge.png"
            class="filter-menu__side-badge"
            draggable="false"
            :class="{'-selected': filters.side === 'T'}"
            @click="selectSideFilter('T')"
          />
          <img
            src="@/assets/icons/ct_badge.png"
            class="filter-menu__side-badge"
            draggable="false"
            :class="{'-selected': filters.side === 'CT'}"
            @click="selectSideFilter('CT')"
          />
        </div>
      </fieldset>
      <fieldset class="filter-menu__fieldset">
        <label class="filter-menu__label" for="type">Type</label>
        <div class="filter-menu__radio-wrapper">
          <span
            class="filter-menu__filter-type filter-menu__filter-type--pistol"
            :class="{'-selected': filters.type === 'PISTOL'}"
            @click="selectTypeFilter('PISTOL')"
          >pistol</span>
          <span
            class="filter-menu__filter-type filter-menu__filter-type--force"
            :class="{'-selected': filters.type === 'FORCE'}"
            @click="selectTypeFilter('FORCE')"
          >force</span>
          <span
            class="filter-menu__filter-type filter-menu__filter-type--buyround"
            :class="{'-selected': filters.type === 'BUYROUND'}"
            @click="selectTypeFilter('BUYROUND')"
          >buyround</span>
        </div>
      </fieldset>
      <fieldset class="filter-menu__fieldset">
        <label class="filter-menu__label" for="player">Player</label>
        <multiselect
          class="filter-menu__filter-player"
          :options="playerOptions"
          :searchable="false"
          :allow-empty="true"
          :show-labels="false"
          placeholder="-"
          @select="playerSelected"
        />
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts" src="./filter-menu.ts"></script>
<style lang="scss" src="./filter-menu.scss"></style>