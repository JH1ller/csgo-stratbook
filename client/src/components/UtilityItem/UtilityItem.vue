<template>
  <div class="utility-item" @click="openInLightbox">
    <SmartImage v-if="utilityImage" :src="utilityImage" class="utility-item__image" alt="Utility thumbnail" />
    <div v-else class="utility-item__image utility-item__copy-wrapper">
      <fa-icon icon="expand" class="utility-item__icon-copy" />
    </div>
    <div class="utility-item__side-wrapper">
      <img v-if="utility.side === Sides.T" src="@/assets/icons/t_badge.png" class="utility-item__side" />
      <img v-else src="@/assets/icons/ct_badge.png" class="utility-item__side" />
    </div>
    <UtilityTypeDisplay :type="utility.type" class="utility-item__type" />
    <span class="utility-item__info">
      <div class="utility-item__name">{{ utility.name }}</div>
      <button class="utility-item__context" @click="openMenu"><fa-icon icon="caret-square-down" /></button>
    </span>
  </div>
</template>

<script lang="ts" src="./UtilityItem.ts"></script>
<style lang="scss" src="./UtilityItem.scss"></style>
