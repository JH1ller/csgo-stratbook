<template>
  <section class="changelog">
    <div class="changelog__wrapper">
      <h1 class="changelog__headline">{{ $t('changelog.headline') }}</h1>
      <div
        v-for="item in $t('changelog.changes')"
        :key="item.version"
        class="changelog__change"
      >
        <h3 class="changelog__change-version">{{ item.version }}</h3>
        <ul class="changelog__change-list">
          <li class="changelog__change-date">
            {{ item.date }}
          </li>
          <li v-for="change in item.changes" class="changelog__change-text">
            {{ change }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Changelog extends Vue {}
</script>

<style lang="scss">
.changelog {
  @include grid(12, true);

  &__wrapper {
    @include grid-column(12, 1);
    @include blurry-backdrop;
    @include spacing('padding', 'xs xs sm xl');

    align-items: flex-start;

    @include viewport_mq3 {
      @include spacing('padding', 'md md lg 2xl');
    }

    @include viewport_mq5 {
      @include grid-column(6, 4);
    }
  }

  &__headline {
    @include page-headline;

    @include viewport_mq3 {
      @include typo_hl2(var(--color-text-contrast-70));
      @include spacing('margin-bottom', lg);
    }

    @include viewport_mq6 {
      @include typo_hl1(var(--color-text-contrast-70));
    }
  }

  &__change {
    @include spacing('padding-bottom', md);
    display: flex;
    position: relative;
    flex-direction: column;

    @include viewport_mq3 {
      flex-direction: row;
    }

    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: -32px;
      height: 100%;
      width: 1px;
      background-color: var(--color-green);
    }

    &:first-of-type {
      &:after {
        content: '';
        position: absolute;
        top: 8px;
        left: -40px;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        //border: 2px solid var(--color-text);
        background-color: var(--color-green);
      }

      &:before {
        height: calc(100% - 16px);
      }
    }

    &:last-of-type {
      &:after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: -44px;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        //border: 2px solid var(--color-text);
        background-color: var(--color-green);
      }
    }
  }

  &__change-list {
    @include spacing('margin-top', '2xs');

    display: flex;
    flex-direction: column;

    & :not(:last-of-type) {
      @include spacing('margin-bottom', xs);
    }

    @include viewport_mq3 {
      @include spacing('margin-left', md);
    }
  }

  &__change-version {
    @include typo_hl4(var(--color-text));
    @include spacing('padding', '3xs 2xs');
    @include spacing('margin-bottom', '2xs');

    font-size: 1.35rem;
    background: linear-gradient(
      90deg,
      var(--color-green) 0%,
      var(--color-blue) 100%
    );
    border-radius: 6px;
    align-self: flex-start;
    width: 80px;
    text-align: center;

    @include viewport_mq3 {
      width: 100px;
      min-width: 100px;
      font-size: 1.6rem;
      margin-bottom: 0;
    }
  }

  &__change-date {
    @include typo_link(var(--color-text-contrast-70));

    font-size: 1.1rem;

    @include viewport_mq3 {
      font-size: 1.3rem;
    }
  }

  &__change-text {
    @include typo_text(var(--color-text-contrast-70));

    &:before {
      content: '•';
    }

    @include viewport_mq3 {
      font-size: 1.2rem;
    }
  }
}
</style>
