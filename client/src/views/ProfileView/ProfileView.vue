<template>
  <div class="profile-view">
    <div class="profile-view__content">
      <ProfileForm :profile="profile" @submit="updateProfile" class="profile-view__detail" />
      <img :src="avatar" class="profile-view__avatar" alt="Current User Avatar" />

      <div class="profile-view__btn-wrapper">
        <template>
          <a
            class="profile-view__steam-button"
            :href="steamProfileUrl"
            target="_blank"
            v-if="profile.accountType === 'steam'"
          >
            <fa-icon :icon="['fab', 'steam']" class="profile-view__steam-icon" />
            Steam profile
          </a>
          <button class="profile-view__steam-button" @click.prevent="connectSteam" v-else>
            <fa-icon :icon="['fab', 'steam']" class="profile-view__steam-icon" />
            Connect Steam
          </button>
        </template>
        <button @click="logoutRequest" class="profile-view__btn --logout"><fa-icon icon="sign-out-alt" />Logout</button>
        <button @click="deleteRequest" class="profile-view__btn --delete">
          <fa-icon icon="exclamation-triangle" />Delete Account
        </button>
        <!-- <button @click="getStratExport" class="profile-view__btn --export">
          <fa-icon icon="cloud-download-alt" />Export strats
        </button> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProfileView.ts"></script>
<style lang="scss" src="./ProfileView.scss"></style>
