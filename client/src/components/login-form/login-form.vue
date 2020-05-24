<template>
  <div class="login-form">
    <form class="login-form__fieldset" @submit="loginClicked" novalidate>
      <transition name="fade">
        <span
          class="login-form__error"
          v-if="formMessage"
          :class="{'-error': isError, '-success': isSuccess}"
        >{{ formMessage }}</span>
      </transition>
      <input
        type="email"
        class="login-form__input login-form__input--email"
        placeholder="Email"
        v-model="email"
      />
      <input
        type="password"
        class="login-form__input login-form__input--password"
        placeholder="Password"
        v-model="password"
      />
      <input type="submit" class="login-form__submit" value="Sign in" @click="loginClicked" />
      <span class="login-form__register-text">
        Not registered?
        <router-link :to="{name: 'Register'}" class="login-form__register-link">Create an account</router-link>
      </span>
    </form>
  </div>
</template>

<script lang="ts" src="./login-form.ts"></script>
<style lang="scss" src="./login-form.scss"></style>