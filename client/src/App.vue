<template>
  <div class="app">
    <span class="app__version">Beta {{ appVersion }}</span>
    <span class="app__latency" :content="`${latency} ms`" v-tippy><fa-icon icon="wifi" /></span>
    <DialogWrapper />
    <ToastWrapper />
    <MainMenu :menuOpen="menuOpen" @toggle-menu="toggleMenu" @close-menu="closeMenu" />
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
import pkg from '../package.json';
import { appModule } from './store/namespaces';

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
  @appModule.State latency!: number;
  private menuOpen: boolean = false;
  private appVersion: string = pkg.version;

  private closeMenu() {
    this.menuOpen = false;
  }

  private toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
</script>

<style lang="scss">
@import '~vue-context/dist/css/vue-context.css';
@import '~vue-swatches/dist/vue-swatches.css';

.app {
  font-family: $font_ubuntu-regular;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: hidden;

  &__version {
    position: absolute;
    font-size: 0.8rem;
    top: 0;
    right: 10px;
    background-color: $color--smoke;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0 4px;
    opacity: 0.1;
  }

  &__latency {
    position: absolute;
    font-size: 0.8rem;
    top: 1px;
    right: 90px;
    color: $color--smoke;
    display: flex;
    align-items: center;

    & > * {
      width: 14px;
      height: 14px;
    }
  }
}

.router-view {
  height: 100%;
  padding: 16px;
  overflow-y: scroll;
  overflow-x: hidden;

  @include viewport_mq3 {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding: 24px;
  }
}

.v-context {
  & > li {
    cursor: pointer;

    & > a {
      height: 36px;
      display: flex;
      align-items: center;
      width: 100%;

      & > svg {
        height: 70%;
        margin-right: 16px;
      }
    }
  }
}
</style>
