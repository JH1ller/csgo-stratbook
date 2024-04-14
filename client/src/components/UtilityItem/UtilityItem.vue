<template>
  <div class="utility-item">
    <SmartImage
      v-if="utilityImage"
      :src="utilityImage"
      class="utility-item__image"
      alt="Utility thumbnail"
      @click.native="openInLightbox"
    />
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
      <button v-if="!readOnly" class="utility-item__context" @click="openMenu"><fa-icon icon="caret-down" /></button>
    </span>
    <div class="utility-item__labels">
      <button class="utility-item__label --add" v-if="!readOnly" @click.prevent.stop="labelDialogOpen = true">
        <fa-icon icon="plus" />
      </button>
      <div
        class="utility-item__label"
        :class="{ '-readonly': readOnly }"
        v-for="label in utility.labels"
        :key="label"
        @click.stop="() => removeLabel(label)"
      >
        {{ label }}<fa-icon icon="times" />
      </div>
    </div>
    <LabelsDialog
      v-if="labelDialogOpen"
      :currentLabels="utility.labels"
      :allLabels="allLabels"
      @close="labelDialogOpen = false"
      @add="addLabel"
      @remove="removeLabel"
    />
  </div>
</template>

<script lang="ts" src="./UtilityItem.ts"></script>
<style lang="scss" src="./UtilityItem.scss"></style>
