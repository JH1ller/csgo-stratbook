<template>
  <div class="pose-picker">
    <div class="pose-picker__wrapper" @click="toggleCrouch">
      <img v-if="crouch" src="~@/assets/icons/pose-crouch.png" class="pose-picker__image" />
      <img v-else src="@/assets/icons/pose-stand.png" class="pose-picker__image" />
    </div>
    <div class="pose-picker__wrapper" @click="toggleMovement">
      <img v-if="movement === UtilityMovement.RUN" src="@/assets/icons/pose-run.png" class="pose-picker__image" />
      <img v-if="movement === UtilityMovement.WALK" src="@/assets/icons/pose-walk.png" class="pose-picker__image" />
      <img v-if="movement === UtilityMovement.STILL" src="@/assets/icons/pose-still.png" class="pose-picker__image" />
    </div>
  </div>
</template>

<script lang="ts" src="./PosePicker.ts"></script>
<style lang="scss" src="./PosePicker.scss"></style>