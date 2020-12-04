<template>
  <div class="type-picker">
    <button
      class="type-picker__button --pistol"
      :class="{ '-selected': value === Types.PISTOL }"
      @click="input(Types.PISTOL)"
    >
      <img class="type-picker__icon" src="~@/assets/icons/pistol.png" />
      <span class="type-picker__label">pistol</span>
    </button>
    <button
      class="type-picker__button --force"
      :class="{ '-selected': value === Types.FORCE }"
      @click="input(Types.FORCE)"
    >
      <img class="type-picker__icon" src="~@/assets/icons/mp5.png" />
      <span class="type-picker__label">force</span>
    </button>
    <button
      class="type-picker__button --buyround"
      :class="{ '-selected': value === Types.BUYROUND }"
      @click="input(Types.BUYROUND)"
    >
      <img class="type-picker__icon --buyround" src="~@/assets/icons/rifle.png" />
      <span class="type-picker__label">buyround</span>
    </button>
  </div>
</template>

<script lang="ts" src="./TypePicker.ts"></script>
<style lang="scss" src="./TypePicker.scss"></style>