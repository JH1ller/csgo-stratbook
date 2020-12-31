<template>
  <div class="team-info">
    <div class="team-info__head">
      <h2 class="team-info__title">{{ teamInfo.name }}</h2>
      <p 
        v-if="teamInfo.website" 
        class="team-info__website" 
        @click="openWebsite"
        v-tippy
        content="Visit website"
      >
        {{ teamInfo.website }}
      </p>
    </div>
    <div class="team-info__manage-wrapper">
      <div class="team-info__fieldset">
        <h3 class="team-info__fieldset-headline">Server actions</h3>
        <div class="team-info__fieldset-content">
          <div
            class="team-info__button --server-copy"
            :inactive="!teamInfo.server.ip"
            @click="copyServer"
            :content="
              teamInfo.server.ip ? 'Copy server connection string' : 'Add gameserver data to use these features'
            "
            v-tippy
          >
            <fa-icon icon="copy" />
          </div>
          <div
            class="team-info__button --server-run"
            :inactive="!teamInfo.server.ip"
            @click="runServer"
            :content="teamInfo.server.ip ? 'Run game and join server' : 'Add gameserver data to use these features'"
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
    </div>
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>
