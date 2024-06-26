<template>
  <li class="member-item" :class="{ '-self': member._id === profile._id, '-online': member.isOnline }">
    <img class="member-item__avatar" :src="resolveStaticImageUrl(member.avatar)" alt="Member Avatar" />
    <div class="member-item__text">
      <a class="member-item__name" :href="steamProfileUrl" target="_blank"
        ><fa-icon v-if="member.accountType === 'steam'" :icon="['fab', 'steam']" class="member-item__steam-icon" />{{
          member.name
        }}</a
      >
      <p class="member-item__role">
        {{ member._id === teamInfo.manager ? 'Captain' : 'Member' }}
      </p>
      <p v-if="member.isOnline || member.lastOnline" class="member-item__tag" :class="{ '-online': member.isOnline }">
        {{ member.isOnline ? 'online' : `${lastOnlineString(member.lastOnline)}` }}
      </p>
    </div>
    <div class="member-item__button-group">
      <button
        v-if="rolesEnabled && isManager && member._id !== profile._id"
        class="member-item__btn"
        :content="member.role === AccessRole.EDITOR ? 'Change role to viewer' : 'Change role to editor'"
        v-tippy
        @click="
          () =>
            updateRole({
              _id: member._id,
              role: member.role === AccessRole.VIEWER ? AccessRole.EDITOR : AccessRole.VIEWER,
            })
        "
      >
        <fa-icon :icon="member.role === AccessRole.EDITOR ? 'pencil-alt' : ['far', 'eye']" /><span
          class="member-item__btn-label"
          >{{ member.role === AccessRole.EDITOR ? 'Editor' : 'Viewer' }}</span
        >
      </button>
      <button
        v-if="isManager && member._id !== teamInfo.manager"
        @click="() => transferManager(member._id)"
        class="member-item__btn"
        v-tippy
        content="Make captain"
      >
        <fa-icon icon="crown" /><span class="member-item__btn-label">Make captain</span>
      </button>
      <button
        v-if="isManager && member._id !== profile._id"
        @click="() => kickMember(member._id)"
        class="member-item__btn"
        v-tippy
        content="Kick player"
      >
        <fa-icon icon="user-times" /><span class="member-item__btn-label">Kick</span>
      </button>
      <v-swatches
        class="member-item__color-picker"
        :value="member.color"
        :swatches="swatches"
        :disabled="profile._id !== teamInfo.manager && member._id !== profile._id"
        :data-disabled="profile._id !== teamInfo.manager && member._id !== profile._id"
        shapes="circles"
        swatch-size="30"
        popover-y="bottom"
        popover-x="left"
        @input="(color) => updateColor({ _id: member._id, color })"
      >
        <button
          slot="trigger"
          :disabled="profile._id !== teamInfo.manager && member._id !== profile._id"
          class="member-item__btn"
          v-tippy
          content="Set color"
        >
          <div class="member-item__color-dot" :style="{ background: member.color }" />
          <span class="member-item__btn-label">Color</span>
        </button>
      </v-swatches>
    </div>
  </li>
</template>

<script lang="ts" src="./MemberItem.ts"></script>
<style lang="scss" src="./MemberItem.scss"></style>
