<template>
  <div class="login-form">
    <form class="login-form__fieldset" @submit="loginClicked">
      <transition name="fade">
        <span class="login-form__error" v-if="formError">{{ formError }}</span>
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
        <span
          class="login-form__register-link"
          @click="registerClicked"
        >Create an account</span>
      </span>
    </form>
  </div>
</template>

<script lang="ts" src="./login-form.ts"></script>
<style lang="scss" src="./login-form.scss"></style>