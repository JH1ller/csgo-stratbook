<template>
  <div class="join-team-view">
    <team-create-form
      @create-clicked="createTeamRequest"
      @update-form-error="updateCreateFormError"
      :formError="createFormError"
    />
    <join-team-form
      @join-clicked="joinTeamRequest"
      @update-form-error="updateJoinFormError"
      :formError="joinFormError"
    />
  </div>
</template>

<script lang="ts" src="./JoinTeamView.ts"></script>
<style lang="scss" src="./JoinTeamView.scss"></style>
