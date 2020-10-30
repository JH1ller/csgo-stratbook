<template>
  <div class="join-team-form">
    <h2 class="join-team-form__headline">Join a team via code</h2>
    <form class="join-team-form__form" enctype="multipart/form-data" ref="form" novalidate>
      <transition name="fade">
        <span class="join-team-form__error" v-if="formError">{{ formError }}</span>
      </transition>
      <label for="code" class="join-team-form__label">Join code</label>
      <input
        type="text"
        class="join-team-form__input join-team-form__input--code"
        v-model="code"
        ref="code"
        id="code"
      />
      <input type="submit" class="join-team-form__submit" value="Join team" @click="joinClicked" />
    </form>
  </div>
</template>

<script lang="ts" src="./join-team-form.ts"></script>
<style lang="scss" src="./join-team-form.scss"></style>