<template>
  <transition-group class="toast-wrapper" name="slide-up" tag="div">
    <div v-for="toast in toasts" :key="toast.id" class="toast-wrapper__toast">
      <p class="toast-wrapper__toast-text">{{ toast.text }}</p>
    </div>
  </transition-group>
</template>

<script lang="ts" src="./ToastWrapper.ts"></script>
<style scoped lang="scss" src="./ToastWrapper.scss"></style>