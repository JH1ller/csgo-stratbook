<template>
  <div class="view-wrapper">
    <div class="login-view">
      <login-form
        ref="login-form"
        @login-clicked="loginRequest"
        @register-clicked="showRegisterForm"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style lang="scss" src="./LoginView.scss"></style>
