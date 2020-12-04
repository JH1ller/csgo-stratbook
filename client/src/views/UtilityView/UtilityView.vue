<template>
  <div class="utility-view">
    <map-picker @map-clicked="updateCurrentMap" :currentMap="currentMap" />
    <UtilityList class="" :utilities="utilitiesOfCurrentMap" @open-in-lightbox="showLightbox" />
    <transition name="fade">
      <FloatingAdd @on-click="showUtilityForm" v-if="!utilityFormOpen" />
    </transition>
    <transition name="fade">
      <UtilityLightbox v-if="lightboxOpen" :utility="currentLightboxUtility" @close="hideLightbox" />
    </transition>

    <transition name="fade">
      <UtilityForm
        v-if="utilityFormOpen"
        :isEdit="utilityFormEditMode"
        :utility="editUtility"
        @submit-utility="utilityFormSubmitted"
        @cancel-clicked="hideUtilityForm"
      />
    </transition>
  </div>
</template>

<script lang="ts" src="./UtilityView.ts"></script>
<style lang="scss" src="./UtilityView.scss"></style>
