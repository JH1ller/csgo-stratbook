<template>
  <div class="profile-form">
    <h2 class="profile-form__headline">Edit profile</h2>
    <TextInput v-model="formFields.name.value" :field="formFields.name" fieldName="name" class="profile-form__input" />
    <TextInput
      v-model="formFields.email.value"
      :field="formFields.email"
      fieldName="email"
      class="profile-form__input"
    />
    <TextInput
      v-model="formFields.password.value"
      :field="formFields.password"
      type="password"
      fieldName="password"
      class="profile-form__input"
    />
    <TextInput
      v-model="repeatField.value"
      :field="repeatField"
      type="password"
      fieldName="password-repeat"
      class="profile-form__input"
    />
    <p class="profile-form__label">Change avatar:</p>
    <ImageUploader class="profile-form__uploader" v-model="files" :limit="1" />
    <button class="profile-form__btn-save" @click="submitClicked">Save</button>
  </div>
</template>

<script lang="ts" src="./ProfileForm.ts"></script>
<style lang="scss" src="./ProfileForm.scss"></style>