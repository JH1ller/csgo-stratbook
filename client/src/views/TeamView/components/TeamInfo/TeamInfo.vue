<template>
  <div class="team-info">
    <SmartImage v-if="teamAvatarUrl" :src="teamAvatarUrl" class="team-info__avatar" alt="Team Logo" />
    <h2 class="team-info__title">{{ teamInfo.name }}</h2>
    <p v-if="teamInfo.website" class="team-info__website" @click="openWebsite" v-tippy content="Visit website">
      {{ teamInfo.website }}
    </p>
    <div class="team-info__code" @click="copyCode" content="Copy join code" v-tippy>
      <p class="team-info__code-text">{{ teamInfo.code }}</p>
      <span class="team-info__code-icon-wrapper">
        <fa-icon class="team-info__code-icon" icon="copy" />
      </span>
    </div>
    <div class="team-info__btn-group">
      <button class="team-info__btn" :disabled="!isManager" @click="showEdit"><fa-icon icon="edit" />Edit team</button>
      <button class="team-info__btn" :disabled="!serverIp" @click="runServer">
        <fa-icon icon="gamepad" />Join Server
      </button>
      <button class="team-info__btn" :disabled="!serverIp" @click="copyServer"><fa-icon icon="copy" />Copy IP</button>
    </div>
    <div class="team-info__danger-zone">
      <button class="team-info__text-btn" @click="leaveTeam">Leave team</button>
      <button v-if="isManager" class="team-info__text-btn" @click="deleteTeam">Delete team</button>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>
