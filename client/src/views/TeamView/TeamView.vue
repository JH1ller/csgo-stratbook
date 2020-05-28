<template>
  <div class="view-wrapper">
    <div class="team-view">
      <team-create-form
        :formMessage="formMessage"
        :formMessageStyle="formMessageStyle"
        @create-clicked="createTeamRequest"
        @update-form-message="updateFormMessage"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./TeamView.ts"></script>
<style lang="scss" src="./TeamView.scss"></style>
