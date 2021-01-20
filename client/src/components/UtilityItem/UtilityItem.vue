<template>
  <div class="utility-item">
    <img :src="utilityImage" class="utility-item__image" @click="openInLightbox" />
    <div class="utility-item__side-wrapper">
      <img v-if="utility.side === Sides.T" src="@/assets/icons/t_badge.png" class="utility-item__side" />
      <img v-else src="@/assets/icons/ct_badge.png" class="utility-item__side" />
    </div>
    <UtilityTypeDisplay :type="utility.type" class="utility-item__type" />
    <span class="utility-item__info">
      <div class="utility-item__name">{{ utility.name }}</div>
      <MouseButtonDisplay class="utility-item__mouse-button" :mouseButtons="utility.mouseButton" />
      <div class="utility-item__pose-wrapper">
        <img v-if="utility.crouch" src="@/assets/icons/pose-crouch.png" class="utility-item__pose" />
        <img v-else src="~@/assets/icons/pose-stand.png" class="utility-item__pose" />
      </div>
      <div class="utility-item__pose-wrapper">
        <img
          v-if="utility.movement === UtilityMovement.RUN"
          src="@/assets/icons/pose-run.png"
          class="utility-item__pose"
        />
        <img
          v-if="utility.movement === UtilityMovement.WALK"
          src="@/assets/icons/pose-walk.png"
          class="utility-item__pose"
        />
        <img
          v-if="utility.movement === UtilityMovement.STILL"
          src="@/assets/icons/pose-still.png"
          class="utility-item__pose"
        />
      </div>
      <button class="utility-item__context" @click="openMenu"><fa-icon icon="ellipsis-v" /></button>
    </span>
  </div>
</template>

<script lang="ts" src="./UtilityItem.ts"></script>
<style lang="scss" src="./UtilityItem.scss"></style>