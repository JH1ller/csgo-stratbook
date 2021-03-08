<template>
  <div class="utility-item" @click="openInLightbox">
    <SmartImage :src="utilityImage" class="utility-item__image" alt="Utility thumbnail" />
    <div class="utility-item__side-wrapper">
      <img v-if="utility.side === Sides.T" src="@/assets/icons/t_badge.png" class="utility-item__side" />
      <img v-else src="@/assets/icons/ct_badge.png" class="utility-item__side" />
    </div>
    <UtilityTypeDisplay :type="utility.type" class="utility-item__type" />
    <span class="utility-item__info">
      <div class="utility-item__name">{{ utility.name }}</div>
      <button class="utility-item__context" @click="openMenu"><fa-icon icon="ellipsis-v" /></button>
    </span>
  </div>
</template>

<script lang="ts" src="./UtilityItem.ts"></script>
<style lang="scss" src="./UtilityItem.scss"></style>