<template>
  <div class="app">
    <span class="app__version">Beta {{ appVersion }}</span>
    <span class="app__latency" :content="`${latency} ms`" v-tippy><fa-icon icon="wifi"/></span>
    <DialogWrapper />
    <ToastWrapper />
    <transition name="fade">
      <MainMenu v-show="!gameMode" :menuOpen="menuOpen" @toggle-menu="toggleMenu" @close-menu="closeMenu" />
    </transition>
    <transition name="fade" mode="out-in">
      <router-view @click.native="closeMenu" class="router-view" :class="{ '-game-mode': gameMode }"></router-view>
    </transition>
    <transition name="fade">
      <CookieBanner v-if="showCookieBanner && isDesktop === false" @close="closeCookieBanner" />
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
import { Dialog } from './components/DialogWrapper/DialogWrapper.models';
import { catchPromise } from './utils/catchPromise';
import StorageService from './services/storage.service';
import { gt, major, minor } from 'semver';

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
  @Provide() storageService: StorageService = StorageService.getInstance();

  @appModule.State latency!: number;
  @appModule.State gameMode!: boolean;
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
      this.initTracking();
    } else {
      this.checkCookies();
    }
    this.checkVersion();
    window.twttr.widgets.load();
  }

  private checkVersion() {
    const currentVersion = this.storageService.get<string>('version');
    if (
      currentVersion &&
      gt(`${major(this.appVersion)}.${minor(this.appVersion)}.0`, `${major(currentVersion)}.${minor(currentVersion)}.0`)
    ) {
      catchPromise(
        this.showDialog({
          key: 'app/update-notice',
          text: `<h1>Stratbook has been updated to ${this.appVersion}.</h1><br>
          <blockquote class="twitter-tweet"><p lang="en" dir="ltr">1.7.0 📈<br>I heard you guys like to use -&gt; arrows in your strats?<br>Arrows and timestamps are now magically visually highlighted! <a href="https://t.co/Z8NOEy0Rgb">pic.twitter.com/Z8NOEy0Rgb</a></p>&mdash; Stratbook (@csgostratbook) <a href="https://twitter.com/csgostratbook/status/1365608034936979457?ref_src=twsrc%5Etfw">February 27, 2021</a></blockquote>`,
          resolveBtn: 'OK',
          confirmOnly: true,
          htmlMode: true,
        })
      );
    }
    this.storageService.set('version', this.appVersion);
  }

  private async initAutoUpdate() {
    const { ipcRenderer } = await import('electron');

    ipcRenderer.on('update-downloaded', (_event, version: string) => {
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
    ipcRenderer.send('start-game-mode');
  }

  private checkCookies() {
    const bannerShown = this.getCookie('bannerShown');
    const allowAnalytics = this.getCookie('allowAnalytics');

    if (!bannerShown) this.showCookieBanner = true;

    this.initTracking(!allowAnalytics);
  }

  private initTracking(disableCookie = false) {
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
  overflow-y: scroll;
  overflow-x: hidden;

  @include viewport_mq3 {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding: 24px;
    transition: margin-left 0.3s ease, width 0.3s ease;

    &.-game-mode {
      margin-left: 0;
      width: 100%;
    }
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

.twitter-tweet {
  display: none;

  &.twitter-tweet-rendered {
    display: flex;
  }
}
</style>
