<template>
  <div class="team-create-form">
    <form
      class="team-create-form__form"
      @submit="createClicked"
      enctype="multipart/form-data"
      ref="form"
      novalidate
    >
      <transition name="fade">
        <span
          class="team-create-form__error"
          v-if="formMessage"
          :class="{'-error': isError, '-success': isSuccess}"
        >{{ formMessage }}</span>
      </transition>
      <label for="name" class="team-create-form__label">Team name</label>
      <input
        type="text"
        class="team-create-form__input"
        v-model="formData.name"
        ref="name"
        id="name"
      />
      <label for="password" class="team-create-form__label">Join password</label>
      <input
        type="text"
        class="team-create-form__input"
        v-model="formData.password"
        ref="password"
        id="password"
      />
      <label for="file" class="team-create-form__label">Team Logo</label>
      <label class="team-create-form__file">
        <input type="file" id="file" @change="fileSelected" accept="image/*" />
        <span ref="file-input" file-input-value="Choose logo..."></span>
      </label>
      <input
        type="submit"
        class="team-create-form__submit"
        value="Create team"
        @click="createClicked"
      />
    </form>
  </div>
</template>

<script lang="ts" src="./team-create-form.ts"></script>
<style lang="scss" src="./team-create-form.scss"></style>