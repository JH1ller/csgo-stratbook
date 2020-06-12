<template>
  <div class="view-wrapper">
    <div class="team-view">
      <div v-if="!hasTeam" class="team-view__create-wrapper">
        <team-create-form @create-clicked="createTeamRequest" ref="create-form" />
        <join-team-form @join-clicked="joinTeamRequest" ref="join-form" />
      </div>
      <div v-else class="team-view__info-wrapper">
        <team-info />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
