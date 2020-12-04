<template>
  <div class="login-view">
    <login-form 
      @login-clicked="loginRequest" 
      @update-form-error="updateFormError"
      :formError="formError"
    />
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style lang="scss" src="./LoginView.scss"></style>
