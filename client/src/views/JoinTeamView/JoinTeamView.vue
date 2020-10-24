<template>
  <div class="join-team-view">
    <team-create-form @create-clicked="createTeamRequest" ref="create-form" />
    <join-team-form @join-clicked="joinTeamRequest" ref="join-form" />
  </div>
</template>

<script lang="ts" src="./JoinTeamView.ts"></script>
<style lang="scss" src="./JoinTeamView.scss"></style>
