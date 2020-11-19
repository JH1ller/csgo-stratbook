<template>
  <div class="view-wrapper">
    <div class="profile-view">
      <button @click="logoutRequest" class="profile-view__btn-logout">Logout</button>
      <StratEditor class="profile-view__editor" :teamMembers="teamMembers" />
    </div>
  </div>
</template>

<script lang="ts" src="./ProfileView.ts"></script>
<style lang="scss" src="./ProfileView.scss"></style>
