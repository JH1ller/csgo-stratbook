<template>
  <div class="view-wrapper">
    <div class="login-view">
      <transition name="fade">
        <register-form
          v-if="registerFormVisible"
          key="register"
          ref="register-form"
          @login-clicked="toggleRegisterForm"
          @register-clicked="toggleRegisterForm"
        />
        <login-form
          v-else
          key="login"
          ref="login-form"
          @login-clicked="loginRequest"
          @register-clicked="toggleRegisterForm"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" src="./LoginView.ts"></script>
<style lang="scss" src="./LoginView.scss"></style>
