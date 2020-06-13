<template>
  <div class="team-info">
    <div class="team-info__container">
      <div class="team-info__left-wrapper">
        <h2 class="team-info__title">{{teamInfo.name}}</h2>
        <p class="team-info__website">{{teamInfo.website}}</p>
        <span class="team-info__server" @click="copyServer">{{teamInfo.server}}</span>
        <span class="team-info__code">
          {{teamInfo.code}}
          <font-awesome-icon icon="copy" class="team-info__code-copy" @click="copyCode" />
        </span>
      </div>
      <div class="team-info__right-wrapper">
        <img :src="avatarUrl" alt class="team-info__avatar" />
        <ol class="team-info__member-list">
          <p class="team-info__member-header">Members</p>
          <li
            class="team-info__member"
            :class="{ '-self': player._id === profile._id }"
            v-for="player in teamMembers"
            :key="player._id"
          >
            <span class="team-info__member-name">
              <font-awesome-icon
                v-if="player._id === teamInfo.createdBy"
                icon="crown"
                class="team-info__captain-icon"
              />
              {{ player.name }}
            </span>
            <img class="team-info__member-avatar" :src="resolveAvatar(player.avatar)" />
          </li>
        </ol>
        <span class="team-info__leave" @click="leaveTeam">Leave team</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./team-info.ts"></script>
<style lang="scss" src="./team-info.scss"></style>