<template>
  <div class="reset-password-view">
    <ResetPasswordForm @submit="resetPasswordRequest" @update-form-error="updateFormError" :formError="formError" />
  </div>
</template>

<script lang="ts" src="./ResetPasswordView.ts"></script>
<style lang="scss" src="./ResetPasswordView.scss"></style>
