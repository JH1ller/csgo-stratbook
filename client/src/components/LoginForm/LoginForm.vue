<template>
  <form class="login-form" @submit.prevent="handleSubmit" novalidate>
    <img alt="Application Logo" src="@/assets/images/new_logo_a.png" class="login-form__logo" />
    <div class="login-form__steam-container">
      <img class="login-form__steam" src="@/assets/images/steam_button.png" @click.prevent="steamLogin" />
    </div>
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

    <router-link :to="{ name: 'ForgotPassword' }" class="login-form__forgot-password">Forgot password</router-link>
  </form>
</template>

<script lang="ts" src="./LoginForm.ts"></script>
<style lang="scss" src="./LoginForm.scss"></style>
