<template>
  <div class="confirm-dialog">
    <div class="confirm-dialog__window">
      <p class="confirm-dialog__text">{{ text }}</p>
      <div class="confirm-dialog__buttons">
        <button class="confirm-dialog__btn-confirm" @click="confirmClicked">
          Confirm
          <font-awesome-icon icon="check" />
        </button>
        <button class="confirm-dialog__btn-cancel" @click="cancelClicked">
          Cancel
          <font-awesome-icon icon="ban" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ConfirmDialog.ts"></script>
<style lang="scss" src="./ConfirmDialog.scss"></style>