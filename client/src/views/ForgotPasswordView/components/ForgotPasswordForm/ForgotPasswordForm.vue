<template>
  <form class="forgot-password-form" @submit.prevent="submitClicked" novalidate>
    <img src="@/assets/icons/logo.svg" class="forgot-password-form__logo" alt="Application Logo" />
    <transition name="fade">
      <span class="forgot-password-form__error" v-if="formError">{{ formError }}</span>
    </transition>
    <TextInput
      type="email"
      class="forgot-password-form__input"
      v-model="email.value"
      :field="email"
      fieldName="email"
    />

    <button type="submit" class="forgot-password-form__submit">Request password change</button>
    <span class="forgot-password-form__login-text">
      Wrong here?
      <router-link :to="{ name: 'Login' }" class="forgot-password-form__login-link">Back to Login</router-link>
    </span>
  </form>
</template>

<script lang="ts" src="./ForgotPasswordForm.ts"></script>
<style lang="scss" src="./ForgotPasswordForm.scss"></style>
