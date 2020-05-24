<template>
  <div class="register-form">
    <form
      class="register-form__fieldset"
      @submit="registerClicked"
      enctype="multipart/form-data"
      novalidate
    >
      <transition name="fade">
        <span
          class="register-form__error"
          v-if="formMessage"
          :class="{'-error': isError, '-success': isSuccess}"
        >{{ formMessage }}</span>
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
      <input
        type="file"
        class="register-form__input"
        value="File"
        @change="fileSelected"
        accept="image/*"
      />
      <input type="submit" class="register-form__submit" value="Register" @click="registerClicked" />
      <span class="register-form__register-text">
        Already registered?
        <router-link :to="{name: 'Login'}" class="register-form__register-link">Login</router-link>
      </span>
    </form>
  </div>
</template>

<script lang="ts" src="./register-form.ts"></script>
<style lang="scss" src="./register-form.scss"></style>