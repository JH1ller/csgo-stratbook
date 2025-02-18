<template>
  <div class="team-info">
    <SmartImage v-if="teamAvatarUrl" :src="teamAvatarUrl" class="team-info__avatar" alt="Team Logo" />
    <div class="team-info__info-wrapper">
      <h2 class="team-info__title">{{ teamInfo.name }}</h2>
      <p v-if="teamInfo.website" class="team-info__website" @click="openWebsite" v-tippy content="Visit website">
        {{ teamInfo.website }}
      </p>
      <div class="team-info__code">
        <p class="team-info__code-text">{{ teamInfo.code }}</p>
        <span class="team-info__code-icon-wrapper" @click="copyCode" content="Copy join code" v-tippy>
          <fa-icon class="team-info__code-icon" icon="copy" />
        </span>
      </div>
    </div>
    <div class="team-info__actions-wrapper">
      <button class="team-info__btn" :disabled="!isManager" @click="showEdit">
        <fa-icon icon="edit" /><span class="team-info__btn-label">Edit team</span>
      </button>
      <button class="team-info__btn" :disabled="!serverIp" @click="runServer">
        <fa-icon icon="gamepad" /><span class="team-info__btn-label">Join server</span>
      </button>
      <button class="team-info__btn" :disabled="!serverIp" @click="copyServer">
        <fa-icon icon="copy" /><span class="team-info__btn-label">Copy IP</span>
      </button>
      <div class="team-info__danger-zone">
        <button class="team-info__text-btn" @click="leaveTeam">Leave team</button>
        <button v-if="isManager" class="team-info__text-btn" @click="deleteTeam">Delete team</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>
