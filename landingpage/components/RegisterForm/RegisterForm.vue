<template>
  <form
    class="register-form"
    novalidate
    data-splitbee-event="Submit: Registration"
    @submit.prevent="handleSubmit"
  >
    <transition name="fade">
      <span v-if="formError" class="register-form__error">{{ formError }}</span>
    </transition>
    <TextInput
      v-model="formFields.name.value"
      class="register-form__input"
      :field="formFields.name"
    />
    <TextInput
      v-model="formFields.email.value"
      class="register-form__input"
      :field="formFields.email"
    />
    <TextInput
      v-model="formFields.password.value"
      type="password"
      class="register-form__input"
      :field="formFields.password"
    />
    <TextInput
      v-model="passwordRepeat.value"
      type="password"
      class="register-form__input"
      :field="passwordRepeat"
    />
    <TextInput
      v-model="formFields.key.value"
      v-tippy
      type="text"
      class="register-form__input --key"
      :field="formFields.key"
      content="During beta phase, you can only create an account with a beta access key. To apply for beta access you can write an email to support@stratbook.live"
    />
    <p class="register-form__label">Avatar:</p>
    <ImageUploader
      v-model="files"
      class="register-form__image-uploader"
      :limit="1"
    />
    <input type="submit" class="register-form__submit" value="Register" />
    <span class="register-form__register-text">
      Already registered?
      <a href="https://app.stratbook.live" class="register-form__register-link">
        Open App
      </a></span
    >
  </form>
</template>

<script lang="ts" src="./RegisterForm.ts"></script>
<style lang="scss" src="./RegisterForm.scss"></style>
