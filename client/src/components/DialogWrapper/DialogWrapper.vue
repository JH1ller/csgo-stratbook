<template>
  <div class="dialog-wrapper">
    <transition-group name="fade" tag="div">
      <ConfirmDialog
        v-for="dialog in openDialogs"
        :key="dialog.key"
        v-bind="dialog"
        @close="closeDialog(dialog.key)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts" src="./DialogWrapper.ts"></script>
<style lang="scss" src="./DialogWrapper.scss"></style>