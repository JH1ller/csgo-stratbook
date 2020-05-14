<template>
  <div class="step-item">
    <div class="step-item__container" :class="{'-edit': editMode}" @dblclick="enableEditMode">
      <input
        type="text"
        class="step-item__description"
        :readonly="!editMode"
        v-model="descriptionCopy"
      />
      <div class="step-item__grenade-wrapper">
        <img
          src="@/assets/icons/grenade.png"
          class="step-item__grenade-item"
          :class="{'-active': activeGrenadesCopy.grenade}"
          @click="toggleGrenade('GRENADE')"
        />
        <img
          src="@/assets/icons/smoke.png"
          class="step-item__grenade-item"
          :class="{'-active': activeGrenadesCopy.smoke}"
          @click="toggleGrenade('SMOKE')"
        />
        <img
          src="@/assets/icons/flashbang.png"
          class="step-item__grenade-item"
          :class="{'-active': activeGrenadesCopy.flashbang}"
          @click="toggleGrenade('FLASHBANG')"
        />
        <img
          src="@/assets/icons/flashbang.png"
          class="step-item__grenade-item"
          :class="{'-active': activeGrenadesCopy.flashbangTwo}"
          @click="toggleGrenade('FLASHBANG_TWO')"
        />
        <img
          src="@/assets/icons/molotov.png"
          class="step-item__grenade-item"
          :class="{'-active': activeGrenadesCopy.molotov}"
          @click="toggleGrenade('MOLOTOV')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./step-item.ts"></script>
<style lang="scss" src="./step-item.scss"></style>