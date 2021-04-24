<template>
  <div class="member-item">
    <li
      class="member-item__wrapper"
      :class="{ '-self': member.id === profile.id, '-online': member.isOnline }"
      :key="member.id"
      @click.prevent="openMenu"
      @contextmenu.prevent="openMenu"
    >
      <div class="member-item__text">
        <span class="member-item__name">
          <fa-icon v-if="member.id === teamInfo.manager" icon="crown" class="member-item__captain-icon" />
          {{ member.name }}
        </span>
        <p class="member-item__last-online">
          {{ member.isOnline ? 'online' : lastOnlineString(member.lastOnline) }}
        </p>
      </div>
      <img class="member-item__avatar" :src="resolveStaticImageUrl(member.avatar)" alt="Member Avatar" />
    </li>
  </div>
</template>

<script lang="ts" src="./MemberItem.ts"></script>
<style lang="scss" src="./MemberItem.scss"></style>
