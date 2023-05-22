<template>
  <nav class="navbar">
    <NuxtLink :to="localePath('index')" class="navbar__logo-wrapper">
      <img
        src="@/assets/images/logo_small.png"
        alt="App Logo"
        class="navbar__logo"
      />
      <span class="navbar__label">stratbook</span>
    </NuxtLink>
    <button class="navbar__burger-btn" @click="menuOpen = !menuOpen">
      <div
        class="navbar__burger"
        :class="{ active: menuOpen, 'not-active': !menuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
    <div class="navbar__links">
      <NuxtLink class="navbar__link" :to="localePath('faq')">{{
        $t('navbar.faq')
      }}</NuxtLink>
      <NuxtLink class="navbar__link" :to="localePath('changelog')">{{
        $t('navbar.changelog')
      }}</NuxtLink>
      <a class="navbar__link" href="https://app.stratbook.pro/#/register">{{
        $t('navbar.register')
      }}</a>
      <a
        href="https://twitter.com/csgostratbook"
        class="navbar__link --social"
        rel="noreferrer"
        target="_blank"
      >
        <fa-icon :icon="['fab', 'twitter']" />
      </a>
      <a
        href="https://discord.com/invite/mkxzQJGRgq"
        class="navbar__link --social"
        rel="noreferrer"
        target="_blank"
      >
        <fa-icon :icon="['fab', 'discord']" />
      </a>
      <a
        href="https://github.com/JH1ller/csgo-stratbook"
        rel="noreferrer"
        class="navbar__link --social"
        target="_blank"
      >
        <fa-icon :icon="['fab', 'github']" />
      </a>
    </div>
    <div class="navbar__mobile-menu" :class="{ '-active': menuOpen }">
      <div class="navbar__mobile-links">
        <NuxtLink
          class="navbar__mobile-link"
          :to="localePath('faq')"
          @click.native="menuOpen = false"
          >{{ $t('navbar.faq') }}</NuxtLink
        >
        <NuxtLink
          class="navbar__mobile-link"
          :to="localePath('changelog')"
          @click.native="menuOpen = false"
          >{{ $t('navbar.changelog') }}</NuxtLink
        >
        <a
          class="navbar__mobile-link"
          href="https://app.stratbook.pro/#/register"
          @click="menuOpen = false"
          >{{ $t('navbar.register') }}</a
        >
        <a
          href="https://twitter.com/csgostratbook"
          class="navbar__mobile-link --social"
          rel="noreferrer"
          target="_blank"
          @click="menuOpen = false"
        >
          <fa-icon :icon="['fab', 'twitter']" />
        </a>
        <a
          href="https://discord.com/invite/mkxzQJGRgq"
          class="navbar__mobile-link --social"
          rel="noreferrer"
          target="_blank"
          @click="menuOpen = false"
        >
          <fa-icon :icon="['fab', 'discord']" />
        </a>
        <a
          href="https://github.com/JH1ller/csgo-stratbook"
          rel="noreferrer"
          target="_blank"
          class="navbar__mobile-link --social"
          @click="menuOpen = false"
        >
          <fa-icon :icon="['fab', 'github']" />
        </a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Navbar extends Vue {
  private menuOpen = false;
}
</script>

<style lang="scss">
.navbar {
  @include grid(12, true);

  align-items: center;
  height: 60px;
  background-color: $color--shark;
  z-index: 9;

  @include viewport_mq6 {
    height: 100px;
  }

  &__logo-wrapper {
    @include grid-column(8, 1);

    cursor: pointer;
    height: 50%;
    align-self: center;
    display: flex;
    align-items: center;
    position: absolute;

    @include viewport_mq3 {
      @include grid-column(4, 1);
    }

    @include viewport_mq5 {
      @include grid-column(2, 3);

      height: 60%;
    }
  }

  &__logo {
    height: 100%;
  }

  &__label {
    @include spacing('margin-left', xs);
    @include typo_logo;

    font-size: 1.5rem;

    @include viewport_mq6 {
      font-size: 1.8rem;
    }
  }

  &__burger-btn {
    position: absolute;
    right: 32px;
    z-index: 3;

    width: 32px;
    height: 32px;

    @include viewport_mq3 {
      display: none;
    }
  }

  &__burger {
    @include animated-burger;
  }

  &__mobile-menu {
    z-index: 2;
    background-color: $color--charade;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transition: transform 0.5s ease;
    transform: translateX(100%);

    &.-active {
      transform: translateX(0);
    }

    @include viewport_mq3 {
      display: none;
    }
  }

  &__mobile-links {
    @include spacing('margin-left', xl);

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__mobile-link {
    @include typo_link($color--white);
    @include spacing('margin-bottom', md);

    font-size: 1.5rem;

    &.--social {
      display: flex;

      & > svg {
        width: 32px;
      }
    }
  }

  &__links {
    display: none;

    @include viewport_mq3 {
      @include grid-column(8, 5);

      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: $color--white;
    }

    @include viewport_mq5 {
      @include grid-column(5, 6);
    }
  }

  &__link {
    @include typo_link($color--white);
    @include spacing('margin-left', '2xs');

    border-radius: 8px;
    padding: 10px 16px;
    white-space: nowrap;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: lighten($color--shark, 10%);
    }
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 16px;
      width: 0;
      height: 2px;
      background-color: $color--white;
      transition: width 0.2s ease-in-out;
    }

    &.nuxt-link-active {
      &:after {
        width: calc(100% - 48px);
      }
    }

    &.--social {
      display: flex;

      & > svg {
        width: 24px;

        @include viewport_mq5 {
          width: 28px;
        }

        @include viewport_mq6 {
          width: 32px;
        }
      }
    }

    @include viewport_mq6 {
      @include spacing('margin-left', 'xs');

      font-size: 1.2rem;
    }

    @include viewport_mq7 {
      @include spacing('margin-left', 'lg');

      font-size: 1.35rem;
    }
  }
}
</style>
