<template>
  <form class="login-form" @submit.prevent="handleSubmit" novalidate data-splitbee-event="Submit: Login">
    <img alt="Application Logo" src="@/assets/icons/new_logo_a.png" class="login-form__logo" />
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