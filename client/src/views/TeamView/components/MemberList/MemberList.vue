<template>
  <ol class="member-list">
    <p class="member-list__header">Members</p>
    <li
      class="member-list__member"
      :class="{ '-self': player._id === profile._id, '-online': player.isOnline }"
      v-for="player in teamMembers"
      :key="player._id"
    >
      <div class="member-list__member-text">
        <span class="member-list__member-name">
          <font-awesome-icon
            v-if="player._id === teamInfo.manager"
            icon="crown"
            class="member-list__captain-icon"
          />
          {{ player.name }}
        </span>
        <p
          class="member-list__member-last-online"
        >{{ player.isOnline ? 'online' : lastOnlineString(player.lastOnline) }}</p>
        </div>
        <img class="member-list__member-avatar" :src="resolveAvatar(player.avatar)" />
      </li> 
    <span class="member-list__leave" @click="leaveTeam" data-tooltip="Leave the team">Leave team</span>
  </ol>
</template>

<script lang="ts" src="./MemberList.ts"></script>
<style lang="scss" src="./MemberList.scss"></style>
