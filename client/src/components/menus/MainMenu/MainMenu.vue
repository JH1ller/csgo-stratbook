<template>
  <div class="main-menu">
    <ul class="main-menu__list" :class="{ '-open': menuOpen }">
      <router-link to="/" class="main-menu__list-item main-menu__logo">
        <img
          src="@/assets/icons/logo_small.png"
          class="main-menu__icon main-menu__logo-icon"
          :class="{ '-loading': loading }"
          alt="Application Logo"
        />
        <span class="main-menu__label main-menu__logo-label">{{ appName }}</span>
      </router-link>

      <router-link
        v-for="(item, index) in menuItems"
        :to="item.link"
        @click.native="closeMenu"
        class="main-menu__list-item"
        :key="item.label"
      >
        <fa-icon :icon="item.icon" class="main-menu__icon" />
        <span class="main-menu__label" :style="{ transitionDelay: '0.' + index + 's' }">{{ item.label }}</span>
      </router-link>
      <a
        class="main-menu__list-item main-menu__link --twitter"
        href="https://twitter.com/csgostratbook"
        rel="noreferrer"
        target="_blank"
        ><fa-icon :icon="['fab', 'twitter']" />twitter</a
      >
      <a class="main-menu__list-item main-menu__link --download" @click="downloadDesktopClient"
        ><fa-icon icon="download" />Get desktop client</a
      >
      <a
        class="main-menu__list-item main-menu__link --feedback"
        data-feedback-fish
        :data-feedback-fish-userid="profile.email"
      >
        <fa-icon icon="comment" />Feedback
      </a>
      <router-link class="main-menu__list-item main-menu__link --imprint" :to="Routes.Imprint"
        ><fa-icon icon="balance-scale" />Legal Notice
      </router-link>
      <router-link to="/profile" class="main-menu__profile" v-if="profile._id">
        <img :src="avatarUrl" class="main-menu__avatar" alt="User Avatar" />
        <span class="main-menu__label main-menu__profile-label">{{ profile.name }}</span>
      </router-link>
    </ul>
    <div class="main-menu__mobile" @click="toggleMenu" :class="{ '-open': menuOpen }">
      <div class="main-menu__fab" :class="{ active: menuOpen, 'not-active': !menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <FeedbackFish projectId="092eb5ee119a8c" />
  </div>
</template>

<script lang="ts" src="./MainMenu.ts"></script>
<style lang="scss" src="./MainMenu.scss"></style>
