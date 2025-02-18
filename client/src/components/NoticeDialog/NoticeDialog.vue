<template>
  <BackdropDialog>
    <div class="notice-dialog">
      <div class="notice-dialog__notice">
        <h5 class="notice-dialog__version">{{ currentNotice.version }} 🎉</h5>
        <h2 class="notice-dialog__title">{{ currentNotice.title }}</h2>
        <p class="notice-dialog__text" v-html="currentNotice.content"></p>
        <img
          :src="currentNotice.image"
          :alt="currentNotice.version"
          class="notice-dialog__image"
          v-if="currentNotice.image"
        />
      </div>
      <button class="notice-dialog__btn-close" @click="close"><fa-icon icon="times" /></button>
      <div class="notice-dialog__buttons" v-if="notices.length > 1">
        <button class="notice-dialog__btn" @click="prev"><fa-icon icon="arrow-left" /></button>
        <button class="notice-dialog__btn" @click="next"><fa-icon icon="arrow-right" /></button>
      </div>
    </div>
  </BackdropDialog>
</template>

<script lang="ts" src="./NoticeDialog.ts"></script>
<style lang="scss" src="./NoticeDialog.scss"></style>
