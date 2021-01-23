<template>
  <div class="confirm-dialog">
    <div class="confirm-dialog__window">
      <p class="confirm-dialog__text">{{ text }}</p>
      <div class="confirm-dialog__buttons">
        <button class="confirm-dialog__btn-confirm" @click="confirmClicked">
          <fa-icon icon="check" />
          {{ resolveBtn }}
        </button>
        <button class="confirm-dialog__btn-cancel" @click="cancelClicked">
          <fa-icon icon="ban" />
          {{ rejectBtn }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ConfirmDialog.ts"></script>
<style lang="scss" src="./ConfirmDialog.scss"></style>