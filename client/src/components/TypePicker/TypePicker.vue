<template>
  <div class="type-picker">
    <div
      class="type-picker__button --buyround"
      :class="{ '-selected': value.includes(Types.BUYROUND) }"
      @click="input(Types.BUYROUND)"
    >
      <img class="type-picker__icon --buyround" src="~@/assets/icons/rifle.png" />
      <span class="type-picker__label">buyround</span>
    </div>
    <div
      class="type-picker__button --force"
      :class="{ '-selected': value.includes(Types.FORCE) }"
      @click="input(Types.FORCE)"
    >
      <img class="type-picker__icon" src="~@/assets/icons/mp5.png" />
      <span class="type-picker__label">force</span>
    </div>
    <div
      class="type-picker__button --pistol"
      :class="{ '-selected': value.includes(Types.PISTOL) }"
      @click="input(Types.PISTOL)"
    >
      <img class="type-picker__icon" src="~@/assets/icons/pistol.png" />
      <span class="type-picker__label">pistol</span>
    </div>
  </div>
</template>

<script lang="ts" src="./TypePicker.ts"></script>
<style lang="scss" src="./TypePicker.scss"></style>
