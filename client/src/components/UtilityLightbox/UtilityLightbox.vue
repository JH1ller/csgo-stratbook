<template>
  <BackdropDialog :fullscreen="true" @close="close">
    <div class="utility-lightbox__media-wrapper">
      <iframe
        v-if="currentMedia && currentMedia.type === 'video'"
        class="utility-lightbox__media"
        id="ytplayer"
        type="text/html"
        :src="getEmbedURL(extractVideoId(currentMedia.src) || '', extractTimestamp(currentMedia.src))"
        frameborder="0"
      />
      <SmartImage
        v-else-if="currentMedia"
        :src="resolveImage(currentMedia.src)"
        class="utility-lightbox__media"
        alt="Utility image"
      />
      <div v-else class="utility-lightbox__fallback">
        <fa-icon icon="photo-video" class="utility-lightbox__icon-fallback"></fa-icon>
      </div>
      <transition name="fade">
        <div class="utility-lightbox__crosshair-wrapper" v-if="showCrosshair">
          <div class="utility-lightbox__crosshair-horizontal"></div>
          <div class="utility-lightbox__crosshair-vertical"></div>
        </div>
      </transition>
    </div>
    <div class="utility-lightbox__navigation-wrapper" v-if="mediaList.length > 1">
      <fa-icon icon="chevron-left" class="utility-lightbox__navigation --left" @click="goPrev" />
      <fa-icon icon="chevron-right" class="utility-lightbox__navigation --right" @click="goNext" />
    </div>
    <div class="utility-lightbox__preview-wrapper">
      <SmartImage
        v-for="(item, index) in mediaList"
        :key="item.src"
        :src="item.type === 'image' ? resolveImage(item.src) : getThumbnailURL(extractVideoId(item.src) || '')"
        class="utility-lightbox__preview"
        @click.native="goToIndex(index)"
        :class="{ '-active': index === currentMediaIndex }"
        alt="Lightbox image preview"
      />
    </div>
    <div class="utility-lightbox__badge-wrapper">
      <div class="utility-lightbox__side-wrapper">
        <img
          v-if="utility.side === Sides.T"
          src="@/assets/icons/t_badge.png"
          class="utility-lightbox__side"
          v-tippy
          content="T Side"
        />
        <img v-else src="@/assets/icons/ct_badge.png" class="utility-lightbox__side" v-tippy content="CT Side" />
      </div>
      <UtilityTypeDisplay :type="utility.type" class="utility-lightbox__type" v-tippy content="Type" />
      <div
        class="utility-lightbox__badge"
        @click="showCrosshair = !showCrosshair"
        v-tippy
        content="Toggle Extended Crosshair"
      >
        <img src="@/assets/icons/crosshair.svg" class="utility-lightbox__badge-icon" />
      </div>
      <div
        class="utility-lightbox__badge"
        v-if="utility.setpos"
        @click="copySetpos"
        v-tippy
        content="Copy Setpos Command"
      >
        <fa-icon icon="map-marker-alt" class="utility-lightbox__badge-icon" />
      </div>
    </div>
    <span class="utility-lightbox__description" v-if="utility.description">{{ utility.description }}</span>
    <span class="utility-lightbox__info">
      <span class="utility-lightbox__name">{{ utility.name }}</span>
      <div class="utility-lightbox__icon-wrapper">
        <MouseButtonDisplay class="utility-lightbox__mouse-button" :mouseButtons="utility.mouseButton" />
        <div class="utility-lightbox__pose-wrapper">
          <img
            v-if="utility.crouch"
            src="@/assets/icons/pose-crouch.png"
            class="utility-lightbox__pose"
            v-tippy
            content="Crouch"
          />
          <img v-else src="@/assets/icons/pose-stand.png" class="utility-lightbox__pose --default" />
        </div>
        <div class="utility-lightbox__pose-wrapper">
          <img
            v-if="utility.movement === UtilityMovement.STILL"
            src="@/assets/icons/pose-still.png"
            class="utility-lightbox__pose --default"
          />
          <img
            v-if="utility.movement === UtilityMovement.RUN"
            v-tippy
            content="Run"
            src="@/assets/icons/pose-run.png"
            class="utility-lightbox__pose"
          />
          <img
            v-if="utility.movement === UtilityMovement.WALK"
            v-tippy
            content="Walk"
            src="@/assets/icons/pose-walk.png"
            class="utility-lightbox__pose"
          />
        </div>
        <div class="utility-lightbox__pose-wrapper">
          <img
            v-if="utility.jump"
            src="@/assets/icons/pose-jump.png"
            class="utility-lightbox__pose"
            v-tippy
            content="Jump"
          />
          <img v-else src="@/assets/icons/pose-walk.png" class="utility-lightbox__pose --default" />
        </div>
      </div>
    </span>
  </BackdropDialog>
</template>

<script lang="ts" src="./UtilityLightbox.ts"></script>
<style lang="scss" src="./UtilityLightbox.scss"></style>
