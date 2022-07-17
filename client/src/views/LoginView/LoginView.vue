<template>
  <div class="login-view">
    <LoginForm
      @submit="loginRequest"
      @update-form-error="updateFormError"
      @steam-login="loginWithSteam"
      :formError="formError"
    />
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style lang="scss" src="./LoginView.scss"></style>
