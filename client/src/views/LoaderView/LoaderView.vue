<template>
  <div class="loader-view">
    <p class="loader-view__label">Downloading updates...</p>
    <div class="loader-view__progress-bar">
      <div class="loader-view__progress-bar-progress" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class LoaderView extends Vue {
  progress = 0;

  created() {
    window.ipcService.registerUpdateProgressHandler((progress) => {
      this.progress = progress;
    });
  }
}
</script>

<style lang="scss">
.loader-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $color--navyblue;
  width: 100%;
  height: 100%;

  &__label {
    @include typo_hl2;

    color: white;
  }

  &__progress-bar {
    margin-top: 12px;
    height: 6px;
    width: 200px;
    border-radius: 999px;
    background-color: lighten($color--navyblue, 10%);
    position: relative;
  }

  &__progress-bar-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    background-color: white;
    height: 6px;
    border-radius: 999px;
    transition: width 0.3s ease;
  }
}
</style>
