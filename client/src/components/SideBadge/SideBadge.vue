<template>
  <img v-if="side === Sides.CT" src="@/assets/icons/ct_badge.png" class="side-badge" draggable="false" />
  <img v-else src="@/assets/icons/t_badge.png" class="side-badge" draggable="false" />
</template>

<script lang="ts" src="./SideBadge.ts"></script>
<style lang="scss" src="./SideBadge.scss"></style>
