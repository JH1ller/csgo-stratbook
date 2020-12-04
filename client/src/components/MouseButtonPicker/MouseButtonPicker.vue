<template>
  <div class="mouse-button-picker" @click="!readonly ? input() : null">
    <img src="~@/assets/icons/mouse-base.png" class="mouse-button-picker__image" />
    <transition name="fade">
      <img
        src="~@/assets/icons/mouse-left.png"
        v-if="value === MouseButtons.LEFT || value === MouseButtons.LEFTRIGHT"
        class="mouse-button-picker__image"
      />
    </transition>
    <transition name="fade">
      <img
        src="~@/assets/icons/mouse-right.png"
        v-if="value === MouseButtons.RIGHT || value === MouseButtons.LEFTRIGHT"
        class="mouse-button-picker__image"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./MouseButtonPicker.ts"></script>
<style lang="scss" src="./MouseButtonPicker.scss"></style>