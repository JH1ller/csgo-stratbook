<template>
  <div class="main-menu">
    <ul class="main-menu__list">
      <router-link to="/" class="main-menu__list-item logo">
        <img src="@/assets/icons/logo_white_small.png" class="main-menu__list-item-icon -logo" />
        <span class="main-menu__list-item-label -logo">{{ appName }}</span>
      </router-link>

      <router-link
        v-for="(item, index) in menuItems"
        :to="item.link"
        class="main-menu__list-item"
        :key="item.label"
      >
        <font-awesome-icon :icon="item.icon" class="main-menu__list-item-icon" />
        <span
          class="main-menu__list-item-label"
          :style="{ transitionDelay: '0.' + index + 's' }"
        >{{ item.label }}</span>
      </router-link>
      <router-link to="/profile" class="main-menu__profile" v-if="profile._id">
        <img :src="avatarUrl" class="main-menu__profile-avatar" />
        <span class="main-menu__profile-label">{{ profile.name }}</span>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts" src="./main-menu.ts"></script>
<style lang="scss" src="./main-menu.scss"></style>
