<template>
  <div class="team-create-form">
    <h2 class="team-create-form__headline">Create a team</h2>
    <form class="team-create-form__form" @submit="createClicked" novalidate>
      <transition name="fade">
        <p class="team-create-form__error" v-if="formError">{{ formError }}</p>
      </transition>
      <TextInput class="team-create-form__input" v-model="formFields.name.value" :field="formFields.name" />
      <TextInput class="team-create-form__input" v-model="formFields.website.value" :field="formFields.website" />
      <div class="team-create-form__server-wrapper">
        <TextInput v-model="formFields.serverIp.value" :field="formFields.serverIp" />
        <TextInput v-model="formFields.serverPw.value" :field="formFields.serverPw" />
      </div>
      <p class="team-create-form__label">Logo:</p>
      <ImageUploader v-model="files" :limit="1" />
      <input type="submit" class="team-create-form__submit" value="Create team" />
    </form>
  </div>
</template>

<script lang="ts" src="./TeamCreateForm.ts"></script>
<style lang="scss" src="./TeamCreateForm.scss"></style>
