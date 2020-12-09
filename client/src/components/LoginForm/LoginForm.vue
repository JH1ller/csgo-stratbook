<template>
  <div class="login-form">
    <img src="@/assets/icons/new_logo_a.png" class="login-form__logo" />
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
    <button class="login-form__submit" @click="loginClicked">Sign in</button>
    <span class="login-form__register-text">
      Not registered?
      <router-link :to="{ name: 'Register' }" class="login-form__register-link">Create an account</router-link>
    </span>
  </div>
</template>

<script lang="ts" src="./LoginForm.ts"></script>
<style lang="scss" src="./LoginForm.scss"></style>