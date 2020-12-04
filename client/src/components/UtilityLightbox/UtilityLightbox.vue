<template>
  <div class="utility-lightbox">
    <div class="utility-lightbox__image-wrapper">
      <img :src="currentImage" class="utility-lightbox__image" />
      <transition name="fade">
        <div class="utility-lightbox__crosshair-wrapper" v-if="showCrosshair">
          <div class="utility-lightbox__crosshair-horizontal"></div>
          <div class="utility-lightbox__crosshair-vertical"></div>
        </div>
      </transition>
    </div>
    <div class="utility-lightbox__navigation-wrapper" v-if="utility.images.length > 1">
      <fa-icon icon="chevron-left" class="utility-lightbox__navigation --left" @click="goPrev" />
      <fa-icon icon="chevron-right" class="utility-lightbox__navigation --right" @click="goNext" />
    </div>
    <div class="utility-lightbox__preview-wrapper">
      <img
        v-for="(image, index) in utility.images"
        :key="image"
        :src="resolveImage(image)"
        class="utility-lightbox__preview"
        @click="goToIndex(index)"
        :class="{ '-active': index === currentImageIndex }"
      />
    </div>
    <fa-icon icon="times" class="utility-lightbox__close" @click="close" />
    <div class="utility-lightbox__badge-wrapper">
      <div class="utility-lightbox__side-wrapper">
        <img v-if="utility.side === Sides.T" src="@/assets/icons/t_badge.png" class="utility-lightbox__side" />
        <img v-else src="@/assets/icons/ct_badge.png" class="utility-lightbox__side" />
      </div>
      <UtilityTypeDisplay :type="utility.type" class="utility-lightbox__type" />
      <div class="utility-lightbox__crosshair-btn" @click="showCrosshair = !showCrosshair">
        <img src="@/assets/icons/crosshair.svg" class="utility-lightbox__crosshair-img" />
      </div>
    </div>
    <span class="utility-lightbox__info">
      <div class="utility-lightbox__name">{{ utility.name }}</div>
      <MouseButtonDisplay class="utility-lightbox__mouse-button" :mouseButtons="utility.mouseButton" />
      <div class="utility-lightbox__pose-wrapper">
        <img v-if="utility.crouch" src="@/assets/icons/pose-crouch.png" class="utility-lightbox__pose" />
        <img v-else src="~@/assets/icons/pose-stand.png" class="utility-lightbox__pose" />
      </div>
      <div class="utility-lightbox__pose-wrapper">
        <img
          v-if="utility.movement === UtilityMovement.RUN"
          src="@/assets/icons/pose-run.png"
          class="utility-lightbox__pose"
        />
        <img
          v-if="utility.movement === UtilityMovement.WALK"
          src="@/assets/icons/pose-walk.png"
          class="utility-lightbox__pose"
        />
        <img
          v-if="utility.movement === UtilityMovement.STILL"
          src="@/assets/icons/pose-still.png"
          class="utility-lightbox__pose"
        />
      </div>
    </span>
  </div>
</template>

<script lang="ts" src="./UtilityLightbox.ts"></script>
<style lang="scss" src="./UtilityLightbox.scss"></style>