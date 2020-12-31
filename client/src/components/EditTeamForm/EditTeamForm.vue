<template>
  <BackdropDialog>
    <form class="edit-team-form" @submit.prevent="handleSubmit" novalidate>
      <h2 class="edit-team-form__headline">Edit team</h2>
      <TextInput
        v-model="formFields.name.value"
        :field="formFields.name"
        fieldName="name"
        class="edit-team-form__input"
      />
      <TextInput
        v-model="formFields.website.value"
        :field="formFields.website"
        fieldName="website"
        class="edit-team-form__input"
      />
      <TextInput
        v-model="formFields.serverIp.value"
        :field="formFields.serverIp"
        fieldName="serverIp"
        class="edit-team-form__input"
      />
      <TextInput
        v-model="formFields.serverPw.value"
        :field="formFields.serverPw"
        fieldName="serverPw"
        class="edit-team-form__input"
      />
      <p class="edit-team-form__label">Change logo:</p>
      <ImageUploader class="edit-team-form__uploader" v-model="files" :limit="1" />
      <div class="edit-team-form__button-wrapper">
        <button type="button" class="edit-team-form__btn --cancel" @click="cancel">Cancel</button>
        <button type="submit" class="edit-team-form__btn --save">Save</button>
      </div>
    </form>
  </BackdropDialog>
</template>

<script lang="ts" src="./EditTeamForm.ts"></script>
<style lang="scss" src="./EditTeamForm.scss"></style>