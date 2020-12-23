<template>
  <div class="utility-picker">
    <div
      class="utility-picker__button --smoke"
      :class="{ '-selected': value === Types.SMOKE }"
      @click="input(Types.SMOKE)"
    >
      <img class="utility-picker__icon" src="~@/assets/icons/smoke.png" />
      <span class="utility-picker__label">smoke</span>
    </div>
    <div
      class="utility-picker__button --flash"
      :class="{ '-selected': value === Types.FLASH }"
      @click="input(Types.FLASH)"
    >
      <img class="utility-picker__icon" src="~@/assets/icons/flash.png" />
      <span class="utility-picker__label">flash</span>
    </div>
    <div
      class="utility-picker__button --grenade"
      :class="{ '-selected': value === Types.GRENADE }"
      @click="input(Types.GRENADE)"
    >
      <img class="utility-picker__icon --grenade" src="~@/assets/icons/grenade.png" />
      <span class="utility-picker__label">grenade</span>
    </div>
    <div
      class="utility-picker__button --motolov"
      :class="{ '-selected': value === Types.MOLOTOV }"
      @click="input(Types.MOLOTOV)"
    >
      <img class="utility-picker__icon --molotov" src="~@/assets/icons/molotov.png" />
      <span class="utility-picker__label">molotov</span>
    </div>
  </div>
</template>

<script lang="ts" src="./UtilityPicker.ts"></script>
<style lang="scss" src="./UtilityPicker.scss"></style>