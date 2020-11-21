<template>
  <div id="app">
    <dialog-wrapper />
    <toast-wrapper />
    <view-title ref="ViewTitle"></view-title>
    <main-menu :menuOpen="menuOpen" @toggle-menu="toggleMenu" />
    <transition name="fade" mode="out-in">
      <router-view @click.native="closeMenu" class="router-view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ViewTitle from '@/components/ViewTitle/ViewTitle.vue';
import Loader from '@/components/Loader/Loader.vue';
import ToastWrapper from '@/components/ToastWrapper/ToastWrapper.vue';
import MainMenu from '@/components/menus/MainMenu/MainMenu.vue';
import DialogWrapper from './components/DialogWrapper/DialogWrapper.vue';

@Component({
  components: {
    ViewTitle,
    Loader,
    MainMenu,
    ToastWrapper,
    DialogWrapper,
  },
})
export default class App extends Vue {
  private menuOpen: boolean = false;

  private closeMenu() {
    this.menuOpen = false;
  }

  private toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
</script>

<style lang="scss">
#app {
  font-family: $font_ubuntu-regular;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: $color--light;
  height: 100%;
  overflow: hidden;
}

.router-view {
  //background-color: $color--light;
  background-color: #4c4c53;
  margin-top: 50px;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  height: calc(100% - 50px);
  max-height: calc(100vh - 50px);
  // width: calc(100% - 70px);
  // height: calc(100% - 50px);
  padding-bottom: 30px;
  // max-height: calc(100vh - 50px);
  overflow-y: scroll;
  overflow-x: hidden;

  @include viewport_mq3 {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
