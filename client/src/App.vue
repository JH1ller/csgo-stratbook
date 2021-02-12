<template>
  <div class="app">
    <span class="app__version">Beta {{ appVersion }}</span>
    <span class="app__latency" :content="`${latency} ms`" v-tippy><fa-icon icon="wifi"/></span>
    <DialogWrapper />
    <ToastWrapper />
    <MainMenu :menuOpen="menuOpen" @toggle-menu="toggleMenu" @close-menu="closeMenu" />
    <transition name="fade" mode="out-in">
      <router-view @click.native="closeMenu" class="router-view"></router-view>
    </transition>
    <transition name="fade">
      <CookieBanner v-if="showCookieBanner && !isDesktop" @close="closeCookieBanner" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import ViewTitle from '@/components/ViewTitle/ViewTitle.vue';
import Loader from '@/components/Loader/Loader.vue';
import ToastWrapper from '@/components/ToastWrapper/ToastWrapper.vue';
import MainMenu from '@/components/menus/MainMenu/MainMenu.vue';
import DialogWrapper from './components/DialogWrapper/DialogWrapper.vue';
import CookieBanner from './components/CookieBanner/CookieBanner.vue';
import pkg from '../package.json';
import { appModule } from './store/namespaces';
import TrackingService from '@/services/tracking.service';
import { Toast } from './components/ToastWrapper/ToastWrapper.models';
import { Dialog } from './components/DialogWrapper/DialogWrapper.models';
import { catchPromise } from './utils/catchPromise';

@Component({
  components: {
    ViewTitle,
    Loader,
    MainMenu,
    ToastWrapper,
    DialogWrapper,
    CookieBanner,
  },
})
export default class App extends Vue {
  @Provide() trackingService: TrackingService = TrackingService.getInstance();
  @appModule.State latency!: number;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<void>;

  private menuOpen: boolean = false;
  private appVersion: string = pkg.version;
  private showCookieBanner = false;
  private isDesktop = window.desktopMode;

  private getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return parts
        ?.pop()
        ?.split(';')
        ?.shift();
  }

  private closeCookieBanner() {
    this.showCookieBanner = false;
    this.checkCookies();
  }

  private mounted() {
    if (this.isDesktop) {
      this.initAutoUpdate();
    } else {
      this.checkCookies();
    }
  }

  private initAutoUpdate() {
    const { ipcRenderer } = require('electron');

    ipcRenderer.on('update-downloaded', (event, version: string) => {
      ipcRenderer.removeAllListeners('update-downloaded');
      catchPromise(
        this.showDialog({
          key: 'app/update-downloaded',
          text: `A new update has been downloaded. (${this.appVersion} -> ${version})<br>An app restart is required for the update to take effect. Restart now?`,
          resolveBtn: 'Restart',
          htmlMode: true,
        }),
        () => ipcRenderer.send('restart-app')
      );
    });

    ipcRenderer.send('app-ready');
  }

  private checkCookies() {
    const bannerShown = this.getCookie('bannerShown');
    const allowAnalytics = this.getCookie('allowAnalytics');

    if (!bannerShown) this.showCookieBanner = true;

    this.initTracking(!allowAnalytics);
  }

  private initTracking(disableCookie: boolean) {
    this.trackingService.init(disableCookie);
  }

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
  //padding: 12px;
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
