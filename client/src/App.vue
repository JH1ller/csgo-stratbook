<template>
  <div id="app">
    <loader></loader>
    <view-title ref="ViewTitle"></view-title>
    <main-menu />
    <transition name="fade" mode="out-in">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ViewTitle from '@/components/view-title/view-title.vue';
import Loader from '@/components/loader/loader.vue';
import MainMenu from '@/components/menus/main-menu/main-menu.vue';

@Component({
  components: {
    ViewTitle,
    Loader,
    MainMenu,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Open Sans, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: $color--light;
}

.main-menu {
  z-index: 10;
}

.view-wrapper {
  background-color: $color--light;
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
