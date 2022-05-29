<template>
  <div class="team-info">
    <SmartImage :src="teamAvatarUrl" class="team-info__avatar" alt="Team Logo" />
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
      <button class="team-info__btn"><fa-icon icon="edit" />Edit team</button>
      <button class="team-info__btn"><fa-icon icon="gamepad" />Join Server</button>
      <button class="team-info__btn"><fa-icon icon="copy" />Copy IP</button>
    </div>
    <!-- <div class="team-info__manage-wrapper">
      <div class="team-info__fieldset">
        <h3 class="team-info__fieldset-headline">Server actions</h3>
        <div class="team-info__fieldset-content">
          <div
            class="team-info__button --server-copy"
            :inactive="!serverIp"
            @click="copyServer"
            :content="serverIp ? 'Copy server connection string' : 'Add gameserver data to use these features'"
            v-tippy
          >
            <fa-icon icon="copy" />
          </div>
          <div
            class="team-info__button --server-run"
            :inactive="!serverIp"
            @click="runServer"
            :content="serverIp ? 'Run game and join server' : 'Add gameserver data to use these features'"
            v-tippy
          >
            <fa-icon icon="gamepad" />
          </div>
        </div>
      </div>
      <div class="team-info__fieldset">
        <h3 class="team-info__fieldset-headline">Manage team</h3>
        <div class="team-info__fieldset-content">
          <div class="team-info__code" @click="copyCode" content="Copy join code" v-tippy>
            {{ teamInfo.code }}
            <fa-icon class="team-info__code-copy" icon="copy" />
          </div>
          <div
            class="team-info__button"
            :inactive="!isManager"
            @click="showEdit"
            :content="isManager ? 'Edit team details' : 'Only the manager can edit team details'"
            v-tippy
          >
            <fa-icon icon="edit" />
          </div>
          <div
            class="team-info__button"
            :inactive="!isManager"
            @click="deleteTeam"
            :content="isManager ? 'Delete team' : 'Only the manager can delete the team'"
            v-tippy
          >
            <fa-icon icon="trash-alt" />
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>
