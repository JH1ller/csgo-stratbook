<template>
  <div class="cookie-banner">
    <p class="cookie-banner__base-text">{{ $t('cookieBanner.baseText') }}</p>
    <div class="cookie-banner__options">
      <input
        type="checkbox"
        disabled
        id="requiredCookie"
        class="cookie-banner__checkbox"
        checked
      />
      <label for="requiredCookie" class="cookie-banner__checkbox-label">{{
        $t('cookieBanner.labelRequired')
      }}</label>
      <input
        id="analyticsCookie"
        v-model="analyticsChecked"
        type="checkbox"
        class="cookie-banner__checkbox"
      />
      <label for="analyticsCookie" class="cookie-banner__checkbox-label">{{
        $t('cookieBanner.labelAnalytics')
      }}</label>
    </div>
    <div class="cookie-banner__btn-wrapper">
      <button class="cookie-banner__btn --save" @click="saveClicked">
        {{ $t('cookieBanner.btnSave') }}
      </button>
      <button class="cookie-banner__btn --accept" @click="acceptClicked">
        {{ $t('cookieBanner.btnAcceptAll') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

@Component({})
export default class CookieBanner extends Vue {
  private analyticsChecked = false;

  private setCookie(key: string, value: string) {
    document.cookie = `${key}=${value}; domain=${
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : window.location.hostname
    }; max-age=31536000; path=/`;
  }

  private saveClicked() {
    this.setCookie('bannerShown', 'true');
    this.setCookie('allowAnalytics', this.analyticsChecked.toString());
    this.close();
  }

  private acceptClicked() {
    this.setCookie('bannerShown', 'true');
    this.setCookie('allowAnalytics', 'true');
    this.close();
  }

  @Emit()
  private close() {}
}
</script>

<style lang="scss">
.cookie-banner {
  @include blurry-backdrop;
  @include spacing('padding', xs);

  border-radius: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  @include viewport_mq3 {
    @include spacing('padding', sm);

    width: 400px;
    bottom: 32px;
    left: 32px;
  }

  @include viewport_mq6 {
    @include spacing('padding', md);

    width: 500px;
    bottom: 64px;
    left: 64px;
  }

  &__options {
    @include spacing('margin-top', 'xs');

    display: flex;
    align-items: center;
  }

  &__checkbox-label {
    @include spacing('margin-left', '3xs');
  }

  &__checkbox {
    &:not(:first-of-type) {
      @include spacing('margin-left', 'xs');
    }

    &[disabled] + label {
      color: rgba($color--black, 0.5);
    }
  }

  &__btn-wrapper {
    @include spacing('margin-top', 'xs');

    display: flex;
  }

  &__btn {
    @include spacing('padding', '2xs sm');
    @include typo_button;

    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid $color--green;

    &.--accept {
      background-color: $color--green;
      color: $color--white;
    }

    &.--save {
      color: $color--green;
      background-color: rgba($color--white, 0.3);
    }

    &:first-of-type {
      @include spacing('margin-right', '2xs');
    }
  }
}
</style>
