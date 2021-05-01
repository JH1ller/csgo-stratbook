<template>
  <div class="floating-button" @click="click">
    <fa-icon :icon="icon" class="floating-button__icon" /><span class="floating-button__label" v-if="label">{{
      label
    }}</span>
  </div>
</template>

<script lang="ts" src="./FloatingButton.ts"></script>
<style lang="scss" src="./FloatingButton.scss"></style>