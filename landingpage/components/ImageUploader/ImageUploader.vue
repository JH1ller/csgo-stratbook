<template>
  <div class="image-uploader">
    <label class="image-uploader__input">
      <input
        type="file"
        id="file"
        :multiple="limit > 1"
        @change="filesSelected"
        accept="image/*"
        :disabled="value.length >= limit"
      />
      <span :file-input-value="fileString"></span>
    </label>
    <div class="image-uploader__preview">
      <div class="image-uploader__preview-item" v-for="image in images" :key="image.uri">
        <img :src="image.uri" alt="" class="image-uploader__image" />
        <fa-icon icon="times" class="image-uploader__icon" @click="removeImage(image)" />
      </div>
      <span class="image-uploader__preview-placeholder" :class="{ '-has-content': images.length }"
        >No images selected</span
      >
    </div>
  </div>
</template>

<script lang="ts" src="./ImageUploader.ts"></script>
<style lang="scss" src="./ImageUploader.scss"></style>