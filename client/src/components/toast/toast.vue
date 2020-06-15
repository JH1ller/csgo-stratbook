<template>
  <transition name="slide-up">
    <div class="toast" v-show="show">
      <p class="toast__text">{{ message }}</p>
    </div>
  </transition>
</template>

<script lang="ts" src="./toast.ts"></script>
<style scoped lang="scss" src="./toast.scss"></style>