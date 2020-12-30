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
          :inactive="!teamInfo.server.ip"
          @click="copyServer"
          :content="teamInfo.server.ip ? 'Copy server connection string' : 'Add gameserver data to use these features'"
          v-tippy
        >
          <fa-icon icon="copy" />
        </div>
        <div
          class="team-info__server-run"
          :inactive="!teamInfo.server.ip"
          @click="runServer"
          :content="teamInfo.server.ip ? 'Run game and join server' : 'Add gameserver data to use these features'"
          v-tippy
        >
          <fa-icon icon="gamepad" />
        </div>
      </div>
    </div>
    <div class="team-info__manage-team">
      <h3 class="team-info__manage-team-headline">Manage team</h3>
      <span class="team-info__code" @click="copyCode" content="Copy join code" v-tippy>
        {{ teamInfo.code }}
          <fa-icon class="team-info__code-copy" icon="copy" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" src="./TeamInfo.ts"></script>
<style lang="scss" src="./TeamInfo.scss"></style>