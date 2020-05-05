<template>
  <div class="component">
    <div class="loader__wrapper" ref="Loader" v-if="show">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <span class="loader__text">{{ text }}</span>
    </div>
  </div>
</template>#

<script lang="ts" src="./loader.ts"></script>
<style lang="scss" src="./loader.scss"></style>

