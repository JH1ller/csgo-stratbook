<template>
  <div class="team-info">
    <h2 class="team-info__title">{{ teamInfo.name }}</h2>
    <p
      v-if="teamInfo.website"
      class="team-info__website"
      @click="openWebsite"
    >{{ teamInfo.website }}</p>
    <div class="team-info__server-wrapper">
      <div
        class="team-info__server-copy"
        v-if="teamInfo.server.ip"
        @click="copyServer"
        data-tooltip="Copy server connection string"
      >
        <fa-icon icon="copy" />
      </div>
      <div
        class="team-info__server-run"
        v-if="teamInfo.server.ip"
        @click="runServer"
        data-tooltip="Run game and join server"
      >
        <fa-icon icon="gamepad" />
      </div>
    </div>
    <span class="team-info__code">
      {{teamInfo.code}}
      <div class="team-info__code-copy" @click="copyCode" data-tooltip="Copy join code">
        <fa-icon icon="copy" />
      </div>
    </span>
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>