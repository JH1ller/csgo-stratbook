<template>
  <transition name="fade">
    <div class="dialog-wrapper" v-if="openDialogs.length">
      <transition-group name="fade" tag="div">
        <ConfirmDialog
          v-for="dialog in openDialogs"
          :key="dialog.key"
          v-bind="dialog"
          @close="closeDialog(dialog.key)"
        />
      </transition-group>
    </div>
  </transition>
</template>

<script lang="ts" src="./DialogWrapper.ts"></script>
<style lang="scss" src="./DialogWrapper.scss"></style>
