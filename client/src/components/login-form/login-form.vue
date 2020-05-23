<template>
  <div class="login-form">
    <fieldset class="login-form__fieldset">
      <input type="email" class="login-form__input login-form__input--email" placeholder="Email" />
      <input
        type="password"
        class="login-form__input login-form__input--password"
        placeholder="Password"
      />
      <input type="button" class="login-form__submit" value="Sign in" />
      <span class="login-form__register-text">
        Not registered?
        <span class="login-form__register-link" @click="registerClicked">Create an account</span>
      </span>
    </fieldset>
  </div>
</template>

<script lang="ts" src="./login-form.ts"></script>
<style lang="scss" src="./login-form.scss"></style>