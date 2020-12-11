<template>
  <div class="join-team-view">
    <div class="join-team-view__content">
      <team-create-form
        @submit="createTeamRequest"
        @update-form-error="updateCreateFormError"
        :formError="createFormError"
      />
      <join-team-form @submit="joinTeamRequest" @update-form-error="updateJoinFormError" :formError="joinFormError" />
    </div>
  </div>
</template>

<script lang="ts" src="./JoinTeamView.ts"></script>
<style lang="scss" src="./JoinTeamView.scss"></style>
