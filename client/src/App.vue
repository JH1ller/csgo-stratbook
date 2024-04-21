<template>
  <div class="app">
    <LoadingBar />
    <div class="app__version-wrapper">
      <span class="app__latency" :content="`${latency} ms`" v-tippy><fa-icon icon="wifi" /></span>
      <span class="app__version" @click="toggleDarkMode">{{ appVersion }}</span>
    </div>
    <DialogWrapper @click.native="closeMenu" />
    <ToastWrapper @click.native="closeMenu" />
    <transition name="fade">
      <MainMenu v-show="!gameMode" :menuOpen="menuOpen" @toggle-menu="toggleMenu" @close-menu="closeMenu" />
    </transition>
    <transition name="fade" mode="out-in">
      <router-view
        @click.native="closeMenu"
        class="router-view"
        :class="{ '-game-mode': gameMode, '-fullscreen': $route.meta && $route.meta.fullscreen }"
      ></router-view>
    </transition>
    <transition name="fade">
      <CookieBanner v-if="showCookieBanner && isDesktop === false" @close="closeCookieBanner" />
    </transition>
    <portal-target name="root"></portal-target>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import LoadingBar from '@/components/LoadingBar/LoadingBar.vue';
import ToastWrapper from '@/components/ToastWrapper/ToastWrapper.vue';
import MainMenu from '@/components/menus/MainMenu/MainMenu.vue';
import DialogWrapper from './components/DialogWrapper/DialogWrapper.vue';
import CookieBanner from './components/CookieBanner/CookieBanner.vue';
import pkg from '../package.json';
import { appModule, teamModule } from './store/namespaces';
import TrackingService from '@/services/tracking.service';
import { Dialog } from './components/DialogWrapper/DialogWrapper.models';
import StorageService from './services/storage.service';
import { gt, major, minor } from 'semver';
import { Breakpoints } from './services/breakpoint.service';
import { Team } from './api/models/Team';
import WebSocketService from './services/WebSocketService';
import { getCookie } from './utils/cookie';

@Component({
  components: {
    LoadingBar,
    MainMenu,
    ToastWrapper,
    DialogWrapper,
    CookieBanner,
  },
})
export default class App extends Vue {
  @Provide() trackingService = TrackingService.getInstance();
  @Provide() storageService = StorageService.getInstance();
  wsService = WebSocketService.getInstance();

  @appModule.State latency!: number;
  @appModule.State gameMode!: boolean;
  @appModule.State breakpoint!: Breakpoints;
  @teamModule.State teamInfo!: Team;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;

  menuOpen: boolean = false;
  appVersion: string = pkg.version;
  showCookieBanner = false;
  isDesktop = window.desktopMode;

  closeCookieBanner() {
    this.showCookieBanner = false;
    this.checkCookies();
  }

  mounted() {
    if (this.isDesktop) {
      this.initTracking();
    } else {
      this.checkCookies();
    }
    this.checkVersion();
    window.twttr?.widgets.load();

    window.onbeforeunload = () => {
      this.wsService.disconnect();
    };
    window.appVersion = this.appVersion;
  }

  checkVersion() {
    const currentVersion = this.storageService.get<string>('version');
    if (
      currentVersion &&
      gt(`${major(this.appVersion)}.${minor(this.appVersion)}.0`, `${major(currentVersion)}.${minor(currentVersion)}.0`)
    ) {
      this.showDialog({
        key: 'app/update-notice',
        text: `
        <h1>Stratbook has been updated to v${this.appVersion}.</h1>
          <ul>
            <li>- Strats can be saved from map view when a name is added.</li>
            <li>- Added deeplinks to strat drawing board, e.g. https://app.stratbook.pro/#/strats/[strat-id]</li>
            <li>- minor bug fixes</li>
            <li>- more to come soon!</li>
          </ul>
          `,
        resolveBtn: 'OK',
        confirmOnly: true,
        htmlMode: true,
      });
    }
    this.storageService.set('version', this.appVersion);
  }

  checkCookies() {
    const bannerShown = getCookie('bannerShown') === 'true' || this.storageService.get('bannerShown');
    const allowAnalytics = getCookie('allowAnalytics') === 'true' || this.storageService.get('allowAnalytics');

    if (!bannerShown) this.showCookieBanner = true;

    this.initTracking(!allowAnalytics);
  }

  initTracking(disableCookie = false) {
    if (process.env.NODE_ENV === 'production') {
      this.trackingService.init(disableCookie, { breakpoint: this.breakpoint, team: this.teamInfo.name });
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDarkMode() {
    document.body.classList.toggle('-dark');
  }
}
</script>

<style lang="scss">
@import '~vue-context/dist/css/vue-context.css';
@import '~vue-swatches/dist/vue-swatches.css';

.app {
  height: 100%;
  overflow: hidden;

  &__version-wrapper {
    position: absolute;
    font-size: 0.8rem;
    top: 1px;
    right: 13px;
    color: var(--color-bg-secondary);
    display: flex;
    align-items: center;
  }

  &__version {
    opacity: 0.3;
    margin-left: 6px;
  }

  &__latency {
    & > * {
      width: 14px;
      height: 14px;
    }
  }

  &__darkmode-toggle {
    position: absolute;

    @include spacing('top', 'xs');
    @include spacing('right', 'xs');
  }
}

.router-view {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  @include viewport_mq3 {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding: 24px;
    transition: margin-left 0.3s ease, width 0.3s ease;

    &.-fullscreen {
      padding: 0;
    }

    &.-game-mode {
      margin-left: 0;
      width: 100%;
    }
  }
}

.v-context {
  background-color: var(--color-bg);

  & > li {
    cursor: pointer;

    &.hidden {
      display: none;
    }

    & > a {
      height: 36px;
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--color-text);

      &:hover {
        background-color: var(--color-bg-secondary);
        color: var(--color-text);
      }

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
