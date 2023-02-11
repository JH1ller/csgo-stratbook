<template>
  <div class="pose-picker" :class="{ '-readonly': readonly }">
    <div
      class="pose-picker__wrapper"
      @click="!readonly ? toggleCrouch() : null"
      v-tippy
      :content="readonly ? 'Crouch' : 'Toggle Crouch'"
    >
      <svg-icon name="pose_crouch" v-if="crouch" class="pose-picker__image" />
      <svg-icon name="pose_stand" v-else class="pose-picker__image" />
    </div>
    <div
      class="pose-picker__wrapper"
      @click="!readonly ? toggleMovement() : null"
      v-tippy
      :content="readonly ? 'Movement' : 'Toggle Movement'"
    >
      <svg-icon name="pose_run" v-if="movement === UtilityMovement.RUN" class="pose-picker__image" />
      <svg-icon name="pose_walk" v-if="movement === UtilityMovement.WALK" class="pose-picker__image" />
      <svg-icon name="pose_still" v-if="movement === UtilityMovement.STILL" class="pose-picker__image" />
    </div>
    <div
      class="pose-picker__wrapper"
      @click="!readonly ? toggleJump() : null"
      v-tippy
      :content="readonly ? 'Jump' : 'Toggle Jump'"
    >
      <svg-icon name="pose_jump" v-if="jump" class="pose-picker__image" />
      <svg-icon name="pose_walk" v-else class="pose-picker__image" />
    </div>
  </div>
</template>

<script lang="ts" src="./PosePicker.ts"></script>
<style lang="scss" src="./PosePicker.scss"></style>
