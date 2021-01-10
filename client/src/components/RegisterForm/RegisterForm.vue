<template>
  <form class="register-form" @submit.prevent="handleSubmit" novalidate data-splitbee-event="Submit: Registration">
    <img src="@/assets/icons/new_logo_a.png" class="register-form__logo" />
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
    <TextInput
      type="text"
      class="register-form__input --key"
      v-model="formFields.key.value"
      :field="formFields.key"
      content="During beta phase, you can only create an account with a beta access key. To apply for beta access you can write an email to support@stratbook.live"
      v-tippy
    />

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