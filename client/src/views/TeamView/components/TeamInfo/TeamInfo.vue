<template>
  <div class="team-info">
    <div class="team-info__head">
      <h2 class="team-info__title">{{ teamInfo.name }}</h2>
      <p v-if="teamInfo.website" class="team-info__website" @click="openWebsite">{{ teamInfo.website }}</p>
    </div>
    <div class="team-info__server-fieldset">
      <h3 class="team-info__server-headline">Server actions</h3>
      <div class="team-info__server-wrapper">
        <div
          class="team-info__server-copy"
          v-if="teamInfo.server.ip"
          @click="copyServer"
          content="Copy server connection string"
          v-tippy
        >
          <fa-icon icon="copy" />
        </div>
        <div
          class="team-info__server-run"
          v-if="teamInfo.server.ip"
          @click="runServer"
          content="Run game and join server"
          v-tippy
        >
          <fa-icon icon="gamepad" />
        </div>
      </div>
    </div>
    <div class="team-info__manage-team">
      <h3 class="team-info__manage-team-headline">Manage team</h3>
      <span class="team-info__code">
        {{ teamInfo.code }}
        <div class="team-info__code-copy" @click="copyCode" content="Copy join code" v-tippy>
          <fa-icon icon="copy" />
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>