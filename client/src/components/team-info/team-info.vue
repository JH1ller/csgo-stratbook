<template>
  <div class="team-info">
    <div class="team-info__container">
      <div class="team-info__left-wrapper">
        <h2 class="team-info__title">{{teamInfo.name}}</h2>
        <p
          v-if="teamInfo.website"
          class="team-info__website"
          @click="openWebsite"
        >{{teamInfo.website}}</p>
        <div class="team-info__server-wrapper">
          <div
            class="team-info__server-copy"
            v-if="teamInfo.server.ip"
            @click="copyServer"
            data-tooltip="Copy server connection string"
          >
            <font-awesome-icon icon="copy" />
          </div>
          <div
            class="team-info__server-run"
            v-if="teamInfo.server.ip"
            @click="runServer"
            data-tooltip="Run game and join server"
          >
            <font-awesome-icon icon="gamepad" />
          </div>
        </div>
        <span class="team-info__code">
          {{teamInfo.code}}
          <div class="team-info__code-copy" @click="copyCode" data-tooltip="Copy join code">
            <font-awesome-icon icon="copy" />
          </div>
        </span>
      </div>
      <div class="team-info__right-wrapper">
        <img :src="teamAvatarUrl" alt class="team-info__avatar" />
        <ol class="team-info__member-list">
          <p class="team-info__member-header">Members</p>
          <li
            class="team-info__member"
            :class="{ '-self': player._id === profile._id, '-online': player.isOnline }"
            v-for="player in teamMembers"
            :key="player._id"
          >
            <div class="team-info__member-text">
              <span class="team-info__member-name">
                <font-awesome-icon
                  v-if="player._id === teamInfo.manager"
                  icon="crown"
                  class="team-info__captain-icon"
                />
                {{ player.name }}
              </span>
              <p
                class="team-info__member-last-online"
              >{{ player.isOnline ? 'online' : lastOnlineString(player.lastOnline) }}</p>
            </div>
            <img class="team-info__member-avatar" :src="resolveAvatar(player.avatar)" />
          </li>
          <span class="team-info__leave" @click="leaveTeam" data-tooltip="Leave the team">Leave team</span>
        </ol>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./team-info.ts"></script>
<style lang="scss" src="./team-info.scss"></style>