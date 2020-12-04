<template>
  <div class="side-picker">
    <img
      src="@/assets/icons/t_badge.png"
      class="side-picker__side-badge"
      :class="{ '-selected': value === Sides.T }"
      @click="input(Sides.T)"
    />
    <img
      src="@/assets/icons/ct_badge.png"
      class="side-picker__side-badge"
      :class="{ '-selected': value === Sides.CT }"
      @click="input(Sides.CT)"
    />
  </div>
</template>

<script lang="ts" src="./SidePicker.ts"></script>
<style lang="scss" src="./SidePicker.scss"></style>