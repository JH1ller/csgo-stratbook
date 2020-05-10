<template>
  <div class="step-item">
    <div class="step-item__container">
      <input
        type="text"
        class="step-item__description"
        :class="{'-edit': editMode}"
        :readonly="!editMode"
        @dblclick="enableEditMode"
        v-model="description"
        @keydown="handleKeyDown"
      />
      <div class="step-item__grenade-wrapper">
        <img
          src="@/assets/icons/grenade.png"
          class="step-item__grenade-item"
          :class="{'-active': grenadeActive}"
        />
        <img
          src="@/assets/icons/smoke.png"
          class="step-item__grenade-item"
          :class="{'-active': smokeActive}"
        />
        <img
          src="@/assets/icons/flashbang.png"
          class="step-item__grenade-item"
          :class="{'-active': flashbangActive}"
        />
        <img
          src="@/assets/icons/flashbang.png"
          class="step-item__grenade-item"
          :class="{'-active': flashbangTwoActive}"
        />
        <img
          src="@/assets/icons/molotov.png"
          class="step-item__grenade-item"
          :class="{'-active': molotovActive}"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./step-item.ts"></script>
<style lang="scss" src="./step-item.scss"></style>