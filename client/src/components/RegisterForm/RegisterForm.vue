<template>
  <div class="register-form">
    <form
      class="register-form__form"
      @submit="registerClicked"
      enctype="multipart/form-data"
      ref="form"
      novalidate
    >
      <transition name="fade">
        <span
          class="register-form__error"
          v-if="formError"
        >{{ formError }}</span>
      </transition>
      <input
        type="text"
        class="register-form__input"
        placeholder="Username"
        v-model="formData.name"
        ref="name"
      />
      <input
        type="email"
        class="register-form__input"
        placeholder="Email"
        v-model="formData.email"
        ref="email"
      />
      <input
        type="password"
        class="register-form__input"
        placeholder="Password"
        v-model="formData.password"
        ref="password"
      />
      <input
        type="password"
        class="register-form__input"
        placeholder="Repeat password"
        ref="password-repeat"
      />
      <input
        type="text"
        class="register-form__input"
        placeholder="Access Key"
        v-model="formData.key"
        ref="key"
      />
      <label class="register-form__file">
        <input type="file" id="file" @change="fileSelected" accept="image/*" />
        <span ref="file-input" file-input-value="Choose avatar..."></span>
      </label>
      <input type="submit" class="register-form__submit" value="Register" @click="registerClicked" />
      <span class="register-form__register-text">
        Already registered?
        <router-link :to="{name: 'Login'}" class="register-form__register-link">Login</router-link>
      </span>
    </form>
  </div>
</template>

<script lang="ts" src="./RegisterForm.ts"></script>
<style lang="scss" src="./RegisterForm.scss"></style>