<template>
  <div class="view-wrapper">
    <div class="login-view">
      <login-form @login-clicked="loginRequest" ref="login-form" />
    </div>
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style lang="scss" src="./LoginView.scss"></style>
