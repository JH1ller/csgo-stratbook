<template>
  <div class="utility-list">
    <UtilityItem
      class="utility-list__item"
      v-for="(utility, index) in filteredUtilities"
      :utility="utility"
      :key="utility.id"
      :style="{ 'animation-delay': 0.025 * index + 's' }"
      @open-in-lightbox="openInLightbox"
    />
  </div>
</template>

<script lang="ts" src="./UtilityList.ts"></script>
<style lang="scss" src="./UtilityList.scss"></style>