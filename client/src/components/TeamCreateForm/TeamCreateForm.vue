<template>
  <div class="team-create-form">
    <h2 class="team-create-form__headline">Create a team</h2>
    <form class="team-create-form__form" enctype="multipart/form-data" ref="form" novalidate>
      <transition name="fade">
        <span
          class="team-create-form__error"
          v-if="formError"
        >{{ formError }}</span>
      </transition>
      <label for="name" class="team-create-form__label">Team name</label>
      <input
        type="text"
        class="team-create-form__input"
        v-model="formData.name"
        ref="name"
        id="name"
      />
      <label for="name" class="team-create-form__label">Website</label>
      <input
        type="text"
        class="team-create-form__input"
        v-model="formData.website"
        ref="website"
        id="website"
      />
      <div class="team-create-form__server-wrapper">
        <label for="name" class="team-create-form__label--ip">Server IP</label>
        <input
          type="text"
          class="team-create-form__input--ip"
          v-model="formData.serverIp"
          ref="serverIp"
          id="serverIp"
        />
        <label for="name" class="team-create-form__label--pw">Server Password</label>
        <input
          type="text"
          class="team-create-form__input--pw"
          v-model="formData.serverPw"
          ref="serverPw"
          id="serverPw"
        />
      </div>
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

<script lang="ts" src="./TeamCreateForm.ts"></script>
<style lang="scss" src="./TeamCreateForm.scss"></style>