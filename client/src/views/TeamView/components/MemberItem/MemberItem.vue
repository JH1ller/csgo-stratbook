<template>
<div class="member-item">
  <li
    class="member-item__wrapper"
    :class="{ '-self': member._id === profile._id, '-online': member.isOnline }"
    :key="member._id"
    @click.prevent="openMenu"
    @contextmenu.prevent="openMenu"
  >
    <div class="member-item__text">
      <span class="member-item__name">
        <font-awesome-icon v-if="member._id === teamInfo.manager" icon="crown" class="member-item__captain-icon" />
        {{ member.name }}
      </span>
      <p class="member-item__last-online">
        {{ member.isOnline ? 'online' : lastOnlineString(member.lastOnline) }}
      </p>
    </div>
    <img class="member-item__avatar" :src="resolveAvatar(member.avatar)" />
  </li>
  
</div>
</template>

<script lang="ts" src="./MemberItem.ts"></script>
<style lang="scss" src="./MemberItem.scss"></style>
