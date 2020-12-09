<template>
  <div class="profile-view">
    <div class="profile-view__content">
      <ProfileForm :profile="profile" @submit="updateProfile" class="profile-view__detail" />
      <img :src="avatar" class="profile-view__avatar" />
      <button @click="logoutRequest" class="profile-view__btn-logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts" src="./ProfileView.ts"></script>
<style lang="scss" src="./ProfileView.scss"></style>
