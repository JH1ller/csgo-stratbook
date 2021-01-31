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
  </div>
</template>

<script lang="ts">
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style lang="scss">
.app {
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
  font-family: $font_inter;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

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
  }

  &__footer {
    @include spacing('margin-top', xl);

    width: 100%;

    @include viewport_mq3 {
      @include spacing('margin-top', xl);
    }

    @include viewport_mq6 {
      @include spacing('margin-top', '3xl');
    }
  }
}
</style>
