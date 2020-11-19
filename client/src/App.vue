<template>
  <div id="app">
    <dialog-wrapper />
    <toast-wrapper />
    <view-title ref="ViewTitle"></view-title>
    <main-menu />
    <transition name="fade" mode="out-in">
      <router-view class="router-view"></router-view>
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
export default class App extends Vue {}
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

.main-menu {
  z-index: 10;
}

.router-view {
  //background-color: $color--light;
  background-color: #4c4c53;
  margin-left: 70px;
  margin-right: 70px;
  margin-top: 50px;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  width: calc(100% - 70px);
  height: 100%;
  height: 100vh;
  padding-bottom: 30px;
  max-height: calc(100vh - 50px);
  overflow-y: scroll;
}
</style>
