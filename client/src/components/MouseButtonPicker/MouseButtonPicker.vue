<template>
  <div class="mouse-button-picker" @click="!readonly ? input() : null" :class="{ '-readonly': readonly }">
    <div v-html="require('!!raw-loader!@/assets/icons/mouse_base.svg').default" class="mouse-button-picker__image" />
    <transition name="fade">
      <div
        v-html="require('!!raw-loader!@/assets/icons/mouse_left.svg').default"
        v-if="value === MouseButtons.LEFT || value === MouseButtons.LEFTRIGHT"
        class="mouse-button-picker__image"
      />
    </transition>
    <transition name="fade">
      <div
        v-html="require('!!raw-loader!@/assets/icons/mouse_right.svg').default"
        v-if="value === MouseButtons.RIGHT || value === MouseButtons.LEFTRIGHT"
        class="mouse-button-picker__image"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./MouseButtonPicker.ts"></script>
<style lang="scss" src="./MouseButtonPicker.scss"></style>
