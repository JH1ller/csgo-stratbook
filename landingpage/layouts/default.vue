<template>
  <div class="app">
    <img
      class="app__wave-bg"
      src="@/assets/background.svg"
      alt="app background"
    />
    <Navbar class="app__navbar" />
    <Nuxt class="app__content" />
    <Footer class="app__footer" />
    <transition name="fade">
      <CookieBanner v-if="showCookieBanner" @close="handleClose" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import splitbee from '@splitbee/web';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CookieBanner from '@/components/CookieBanner.vue';

@Component({
  components: {
    Navbar,
    Footer,
    CookieBanner,
  },
})
export default class Default extends Vue {
  private showCookieBanner = false;

  private getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(';').shift();
  }

  private handleClose() {
    this.showCookieBanner = false;
    this.checkCookies();
  }

  private mounted() {
    this.checkCookies();
  }

  private checkCookies() {
    const bannerShown = this.getCookie('bannerShown');
    const allowAnalytics = this.getCookie('allowAnalytics');

    if (!bannerShown) this.showCookieBanner = true;

    this.initTracking(!allowAnalytics);
  }

  private initTracking(disableCookie: boolean) {
    splitbee.init({
      disableCookie,
    });
  }
}
</script>

<style lang="scss">
.app {
  overflow-x: hidden;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  font-family: $font_inter;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: grid;
  grid-template-rows:
    1fr
    auto;

  &__content {
    margin-top: 100px;

    @include viewport_mq3 {
      margin-top: 130px;
    }

    @include viewport_mq6 {
      margin-top: 172px;
    }
  }

  &__wave-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 770px;
    z-index: -1;

    @include viewport_mq4 {
      width: 100%;
    }

    @include viewport_mq7 {
      height: 770px;
    }
  }

  &__navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    @include viewport_mq3 {
      position: absolute;
    }
  }

  &__footer {
    @include spacing('margin-top', xl);

    width: 100%;
  }
}
</style>
