<template>
  <div class="step-item">
    <div
      class="step-item__container"
      :class="{'-edit': editMode}"
      @dblclick="enableEditMode"
      @click="handleClick"
    >
      <input
        type="text"
        class="step-item__description"
        :readonly="!editMode"
        v-model="descriptionCopy"
      />
      <div class="step-item__equipment-wrapper">
        <img
          src="@/assets/icons/grenade.png"
          class="step-item__equipment-item"
          :class="{'-active': equipmentCopy.grenade}"
          @click="toggleEquip('grenade')"
        />
        <img
          src="@/assets/icons/smoke.png"
          class="step-item__equipment-item"
          :class="{'-active': equipmentCopy.smoke}"
          @click="toggleEquip('smoke')"
        />
        <img
          src="@/assets/icons/flashbang.png"
          class="step-item__equipment-item"
          :class="{'-active': equipmentCopy.flashbang}"
          @click="toggleEquip('flashbang')"
        />
        <img
          src="@/assets/icons/flashbang.png"
          class="step-item__equipment-item"
          :class="{'-active': equipmentCopy.flashbangTwo}"
          @click="toggleEquip('flashbangTwo')"
        />
        <img
          src="@/assets/icons/molotov.png"
          class="step-item__equipment-item"
          :class="{'-active': equipmentCopy.molotov}"
          @click="toggleEquip('molotov')"
        />
        <img
          src="@/assets/icons/defusekit.png"
          class="step-item__equipment-item"
          :class="{'-active': equipmentCopy.defuseKit}"
          @click="toggleEquip('defuseKit')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./step-item.ts"></script>
<style lang="scss" src="./step-item.scss"></style>