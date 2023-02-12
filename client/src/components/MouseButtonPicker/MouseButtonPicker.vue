<template>
  <div class="mouse-button-picker" @click="!readonly ? input() : null" :class="{ '-readonly': readonly }">
    <svg-icon name="mouse_base" class="mouse-button-picker__image" />
    <transition name="fade">
      <svg-icon
        name="mouse_left"
        v-if="value === MouseButtons.LEFT || value === MouseButtons.LEFTRIGHT"
        class="mouse-button-picker__image"
      />
    </transition>
    <transition name="fade">
      <svg-icon
        name="mouse_right"
        v-if="value === MouseButtons.RIGHT || value === MouseButtons.LEFTRIGHT"
        class="mouse-button-picker__image"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./MouseButtonPicker.ts"></script>
<style lang="scss" src="./MouseButtonPicker.scss"></style>
