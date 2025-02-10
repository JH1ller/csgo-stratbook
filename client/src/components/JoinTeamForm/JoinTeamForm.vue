<template>
  <div class="join-team-form">
    <h2 class="join-team-form__headline">Join a team via code</h2>
    <form class="join-team-form__form" @submit.prevent="joinClicked" novalidate>
      <transition name="fade">
        <p class="join-team-form__error" v-if="formError">{{ formError }}</p>
      </transition>
      <TextInput class="join-team-form__input" v-model="code.value" :field="code" />
      <input type="submit" class="join-team-form__submit" value="Join team" />
    </form>
  </div>
</template>

<script lang="ts" src="./JoinTeamForm.ts"></script>
<style lang="scss" src="./JoinTeamForm.scss"></style>
