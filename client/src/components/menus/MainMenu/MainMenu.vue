<template>
  <div class="main-menu">
    <ul class="main-menu__list" :class="{ '-open': menuOpen }">
      <router-link to="/" class="main-menu__logo">
        <img
          src="@/assets/icons/logo_small.png"
          class="main-menu__icon main-menu__logo-icon"
          alt="Application Logo"
        />
        <span class="main-menu__label main-menu__logo-label">{{ appName }}</span>
      </router-link>

      <router-link v-for="(item, index) in menuItems" :to="item.link" class="main-menu__list-item" :key="item.label">
        <fa-icon :icon="item.icon" class="main-menu__icon" />
        <span class="main-menu__label" :style="{ transitionDelay: '0.' + index + 's' }">{{ item.label }}</span>
      </router-link>
      <a class="main-menu__list-item main-menu__link --twitter" @click="openTwitter"
        ><fa-icon :icon="['fab', 'twitter']" />twitter</a
      >
      <a class="main-menu__list-item main-menu__link --discord" @click="openDiscord"
        ><fa-icon :icon="['fab', 'discord']" />Discord</a
      >
      <a class="main-menu__list-item main-menu__link --github" @click="openGithub"
        ><fa-icon :icon="['fab', 'github']" />Github</a
      >
      <a v-if="!isDesktop" class="main-menu__list-item main-menu__link --download" @click="downloadDesktopClient"
        ><fa-icon icon="download" />Get desktop app</a
      >
      <!-- Removed for now because it's not working anymore -->
      <!-- <a
        class="main-menu__list-item main-menu__link --feedback"
        data-feedback-fish
        :data-feedback-fish-userid="profile.email"
      >
        <fa-icon icon="comment" />Feedback
      </a> -->
      <a class="main-menu__list-item main-menu__link --kofi" @click="openDonationLink()">
        <fa-icon icon="coffee" />Buy me a coffee
      </a>
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
    <!-- <FeedbackFish projectId="092eb5ee119a8c" /> -->
  </div>
</template>

<script lang="ts" src="./MainMenu.ts"></script>
<style lang="scss" src="./MainMenu.scss"></style>
