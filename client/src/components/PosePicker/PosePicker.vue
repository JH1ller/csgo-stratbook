<template>
  <div class="pose-picker">
    <div class="pose-picker__wrapper" @click="toggleCrouch" v-tippy content="Toggle Crouch">
      <img v-if="crouch" src="~@/assets/icons/pose-crouch.png" class="pose-picker__image" />
      <img v-else src="@/assets/icons/pose-stand.png" class="pose-picker__image" />
    </div>
    <div class="pose-picker__wrapper" @click="toggleMovement" v-tippy content="Toggle Movement">
      <img v-if="movement === UtilityMovement.RUN" src="@/assets/icons/pose-run.png" class="pose-picker__image" />
      <img v-if="movement === UtilityMovement.WALK" src="@/assets/icons/pose-walk.png" class="pose-picker__image" />
      <img v-if="movement === UtilityMovement.STILL" src="@/assets/icons/pose-still.png" class="pose-picker__image" />
    </div>
    <div class="pose-picker__wrapper" @click="toggleJump" v-tippy content="Toggle Jump">
      <img v-if="jump" src="~@/assets/icons/pose-jump.png" class="pose-picker__image" />
      <img v-else src="@/assets/icons/pose-walk.png" class="pose-picker__image" />
    </div>
  </div>
</template>

<script lang="ts" src="./PosePicker.ts"></script>
<style lang="scss" src="./PosePicker.scss"></style>
