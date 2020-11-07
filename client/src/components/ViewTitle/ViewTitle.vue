<template>
  <div class="component">
    <div class="view-title">
      <span class="view-title__text">{{ title }}</span>
      <transition name="fade">
        <Loader class="view-title__loader" v-if="showLoaderCopy" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" src="./ViewTitle.ts"></script>
<style lang="scss" src="./ViewTitle.scss"></style>
