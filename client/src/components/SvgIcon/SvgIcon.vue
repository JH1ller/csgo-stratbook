<template>
  <div class="svg-icon" v-html="require(`!!raw-loader!@/assets/icons/${name}.svg`).default"></div>
</template>

<script lang="ts" src="./SvgIcon.ts"></script>
<style lang="scss" src="./SvgIcon.scss"></style>
