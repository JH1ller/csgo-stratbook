<template>
  <form class="reset-password-form" @submit.prevent="submitClicked" novalidate>
    <img src="@/assets/images/new_logo_a.png" class="reset-password-form__logo" alt="Application Logo" />
    <transition name="fade">
      <span class="reset-password-form__error" v-if="formError">{{ formError }}</span>
    </transition>
    <TextInput
      type="password"
      class="reset-password-form__input"
      v-model="password.value"
      :field="password"
      fieldName="password"
    />
    <TextInput
      type="password"
      class="reset-password-form__input"
      v-model="repeatPassword.value"
      :field="repeatPassword"
      fieldName="repeat-password"
    />

    <button type="submit" class="reset-password-form__submit">Reset password</button>
    <span class="reset-password-form__login-text">
      Wrong here?
      <router-link :to="{ name: 'Login' }" class="reset-password-form__login-link">Back to Login</router-link>
    </span>
  </form>
</template>

<script lang="ts" src="./ResetPasswordForm.ts"></script>
<style lang="scss" src="./ResetPasswordForm.scss"></style>