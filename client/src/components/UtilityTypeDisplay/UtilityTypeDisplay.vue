<template>
  <div class="utility-type-display">
    <img v-if="type === Types.FLASH" class="utility-type-display__icon" src="~@/assets/icons/flash.png" />
    <img v-if="type === Types.SMOKE" class="utility-type-display__icon" src="~@/assets/icons/smoke.png" />
    <img v-if="type === Types.GRENADE" class="utility-type-display__icon" src="~@/assets/icons/grenade.png" />
    <img v-if="type === Types.MOLOTOV" class="utility-type-display__icon" src="~@/assets/icons/molotov.png" />
  </div>
</template>

<script lang="ts" src="./UtilityTypeDisplay.ts"></script>
<style lang="scss" src="./UtilityTypeDisplay.scss"></style>