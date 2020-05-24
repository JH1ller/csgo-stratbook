<template>
  <div class="register-form">
    <form class="register-form__fieldset" @submit="registerClicked">
      <transition name="fade">
        <span class="register-form__error" v-if="formError">{{ formError }}</span>
      </transition>
      <input
        type="text"
        class="register-form__input register-form__input--name"
        placeholder="Username"
        v-model="formData.name"
      />
      <input
        type="email"
        class="register-form__input register-form__input--email"
        placeholder="Email"
        v-model="formData.email"
      />
      <input
        type="password"
        class="register-form__input register-form__input--password"
        placeholder="Password"
        v-model="formData.password"
      />
      <input type="submit" class="register-form__submit" value="Register" @click="registerClicked" />
      <span class="register-form__register-text">
        Already registered?
        <span class="register-form__register-link" @click="loginClicked">Login</span>
      </span>
    </form>
  </div>
</template>

<script lang="ts" src="./register-form.ts"></script>
<style lang="scss" src="./register-form.scss"></style>