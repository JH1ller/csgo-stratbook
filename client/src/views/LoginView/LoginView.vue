<template>
  <div class="view-wrapper">
    <div class="login-view">
      <login-form
        :formMessage="formMessage"
        :formMessageStyle="formMessageStyle"
        @login-clicked="loginRequest"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style lang="scss" src="./LoginView.scss"></style>
