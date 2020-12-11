<template>
  <div class="forgot-password-view">
    <ForgotPasswordForm @submit="forgotPasswordRequest" @update-form-error="updateFormError" :formError="formError" />
  </div>
</template>

<script lang="ts" src="./ForgotPasswordView.ts"></script>
<style lang="scss" src="./ForgotPasswordView.scss"></style>
