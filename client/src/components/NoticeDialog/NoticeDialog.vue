<template>
  <div class="notice-dialog">
    <div class="notice-dialog__window">
      <div class="notice-dialog__notice" v-for="notice in notices" :key="notice._id">
        <h5 class="notice-dialog__title">{{ notice.version }}🎉</h5>
        <p class="notice-dialog__text" v-html="notice.content"></p>
      </div>
      <div class="notice-dialog__buttons">
        <button class="notice-dialog__btn-close" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./NoticeDialog.ts"></script>
<style lang="scss" src="./NoticeDialog.scss"></style>
