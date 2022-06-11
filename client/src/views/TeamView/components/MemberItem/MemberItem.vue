<template>
  <li class="member-item" :class="{ '-self': member._id === profile._id, '-online': member.isOnline }">
    <img class="member-item__avatar" :src="resolveStaticImageUrl(member.avatar)" alt="Member Avatar" />
    <div class="member-item__text">
      <p class="member-item__name">
        {{ member.name }}
      </p>
      <p class="member-item__role">
        {{ member._id === teamInfo.manager ? 'Captain' : 'Member' }}
      </p>
      <p v-if="member.isOnline || member.lastOnline" class="member-item__tag" :class="{ '-online': member.isOnline }">
        {{ member.isOnline ? 'online' : `last online ${lastOnlineString(member.lastOnline)}` }}
      </p>
    </div>
    <div class="member-item__button-group">
      <button v-if="profile._id === teamInfo.manager" class="member-item__btn">
        <fa-icon class="" icon="users" />Role
      </button>
      <button v-if="profile._id === teamInfo.manager" class="member-item__btn">
        <fa-icon class="" icon="user-times" />Kick
      </button>
      <v-swatches
        class="member-item__color-picker"
        :value="member.color"
        :disabled="profile._id !== teamInfo.manager && member._id !== profile._id"
        shapes="circles"
        swatch-size="30"
        popover-y="bottom"
        popover-x="left"
        @input="updateColor"
      >
        <button
          slot="trigger"
          :disabled="profile._id !== teamInfo.manager && member._id !== profile._id"
          class="member-item__btn"
        >
          <div class="member-item__color-dot" :style="{ background: member.color }" />
          Color
        </button>
      </v-swatches>
    </div>
  </li>
</template>

<script lang="ts" src="./MemberItem.ts"></script>
<style lang="scss" src="./MemberItem.scss"></style>
