<template>
  <form class="register-form" @submit.prevent="handleSubmit" novalidate>
    <img src="@/assets/images/new_logo_a.png" class="register-form__logo" alt="Application Logo" />
    <transition name="fade">
      <span class="register-form__error" v-if="formError">{{ formError }}</span>
    </transition>
    <TextInput class="register-form__input" v-model="formFields.name.value" :field="formFields.name" />
    <TextInput class="register-form__input" v-model="formFields.email.value" :field="formFields.email" />
    <TextInput
      type="password"
      class="register-form__input"
      v-model="formFields.password.value"
      :field="formFields.password"
    />
    <TextInput type="password" class="register-form__input" v-model="passwordRepeat.value" :field="passwordRepeat" />
    <p class="register-form__label">Avatar:</p>
    <ImageUploader class="register-form__image-uploader" v-model="files" :limit="1" />
    <input type="submit" class="register-form__submit" value="Register" />
    <span class="register-form__register-text">
      Already registered?
      <router-link :to="{ name: 'Login' }" class="register-form__register-link">Login</router-link>
    </span>
  </form>
</template>

<script lang="ts" src="./RegisterForm.ts"></script>
<style lang="scss" src="./RegisterForm.scss"></style>
