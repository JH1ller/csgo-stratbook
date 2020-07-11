<template>
  <div class="component">
    <div class="view-title">
      <span class="view-title__text">{{ title }}</span>
      <transition name="fade">
        <Loader class="view-title__loader" v-if="showLoader" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" src="./view-title.ts"></script>
<style lang="scss" src="./view-title.scss"></style>
