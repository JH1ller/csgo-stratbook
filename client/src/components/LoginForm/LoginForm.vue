<template>
  <form class="login-form" @submit.prevent="handleSubmit" novalidate>
    <img alt="Application Logo" src="@/assets/icons/logo.svg" class="login-form__logo" />
    <h1 class="login-form__title">Sign in to Stratbook</h1>
    <div v-if="steamEnabled" class="login-form__steam-container">
      <img class="login-form__steam" src="@/assets/images/steam_button.png" @click.prevent="steamLogin" />
    </div>
    <div class="login-form__separator">or</div>
    <transition name="fade">
      <span class="login-form__error" v-if="formError">{{ formError }}</span>
    </transition>
    <TextInput type="email" class="login-form__input" v-model="email.value" :field="email" fieldName="email" />
    <TextInput
      type="password"
      class="login-form__input"
      v-model="password.value"
      :field="password"
      fieldName="password"
    />
    <button type="submit" class="login-form__submit">Sign in</button>
    <span class="login-form__register-text">
      Not registered?
      <router-link :to="{ name: 'Register' }" class="login-form__register-link">Create an account</router-link>
    </span>
    <router-link :to="{ name: 'ForgotPassword' }" class="login-form__forgot-password">Forgot password</router-link>
  </form>
</template>

<script lang="ts" src="./LoginForm.ts"></script>
<style lang="scss" src="./LoginForm.scss"></style>
