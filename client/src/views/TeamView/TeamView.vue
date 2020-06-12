<template>
  <div class="view-wrapper">
    <div class="team-view">
      <team-create-form @create-clicked="createTeamRequest" ref="create-form" />
      <join-team-form @join-clicked="joinTeamRequest" ref="join-form" />
    </div>
  </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
