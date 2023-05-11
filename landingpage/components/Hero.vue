<template>
  <div class="hero">
    <div class="hero__text-wrapper">
      <p class="hero__tagline">{{ $t('index.hero.tagline') }}</p>
      <h1 class="hero__headline">
        {{ $t('index.hero.headline') }}
      </h1>
      <p class="hero__subline">
        {{ $t('index.hero.subline') }}
      </p>
      <div class="hero__button-wrapper">
        <a class="hero__button-app" href="https://app.stratbook.live/">{{
          $t('index.hero.btnOpenApp')
        }}</a>
        <a
          class="hero__button-register"
          href="https://app.stratbook.live/#/register"
          >{{ $t('index.hero.btnRegister') }}</a
        >
      </div>
    </div>
    <div class="hero__screenshot-wrapper">
      <img
        src="@/assets/images/webp/screen.webp"
        alt="App screenshot"
        class="hero__screenshot --desktop"
      />
      <img
        src="@/assets/images/webp/screen_m.webp"
        alt="App mobile screenshot"
        class="hero__screenshot --mobile"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Hero extends Vue {}
</script>

<style lang="scss">
.hero {
  @include grid(12, false);

  min-height: 700px;

  &__screenshot-wrapper {
    @include grid-column(12, 1);
    @include spacing('margin-top', '2xl');

    width: 100%;
    position: relative;

    @include viewport_mq3 {
      @include grid-column(5, 8);
    }

    @include viewport_mq5 {
      @include grid-column(5, 7);
    }
  }

  &__screenshot {
    transform: rotateX(40deg) rotateZ(36deg);
    transform-style: preserve-3d;
    border-radius: 16px;
    box-shadow: 1px 1px 0 1px #f9f9fb, -1px 0 28px 0 rgba(34, 33, 81, 0.01),
      28px 28px 28px 0 rgba(34, 33, 81, 0.25);
    transition: 0.4s ease-in-out transform, 0.4s ease-in-out box-shadow;

    &:hover {
      transform: translate3d(0px, -16px, 0px) rotateX(40deg) rotateZ(36deg);
      box-shadow: 1px 1px 0 1px #f9f9fb, -1px 0 28px 0 rgba(34, 33, 81, 0.01),
        54px 54px 28px -10px rgba(34, 33, 81, 0.15);
    }

    &.--desktop {
      width: 400px;

      @include viewport_mq2 {
        width: 500px;
      }

      @include viewport_mq3 {
        width: 600px;
      }

      @include viewport_mq7 {
        width: 800px;
      }
    }

    &.--mobile {
      position: absolute;
      width: 120px;
      left: 32px;
      bottom: -30px;

      @include viewport_mq2 {
        width: 130px;
        left: 32px;
        bottom: 0px;
      }

      @include viewport_mq3 {
        width: 150px;
        left: 32px;
        bottom: 180px;
      }

      @include viewport_mq7 {
        width: 200px;
        left: 32px;
        top: 100px;
      }
    }
  }

  &__text-wrapper {
    @include grid-column(12, 1);
    @include spacing('margin-top', sm);

    @include viewport_mq3 {
      @include spacing('margin-top', md);
      @include grid-column(7, 1);
    }

    @include viewport_mq5 {
      @include spacing('margin-top', lg);
      @include grid-column(4, 3);
    }
  }

  &__tagline {
    @include typo_tagline(lighten($color--shark, 15%));
    @include spacing('margin-bottom', '2xs');
  }

  &__headline {
    @include typo_hl3($color--shark);

    @include viewport_mq3 {
      @include typo_hl2($color--shark);
    }

    @include viewport_mq6 {
      @include typo_hl1($color--shark);
    }
  }

  &__subline {
    @include spacing('margin-top', xs);
    @include typo_subline(lighten($color--shark, 15%));

    line-height: 1.4;
    text-shadow: 1px 1px 1px rgba($color--peach, 0.3);

    @include viewport_mq3 {
      max-width: 80%;
      line-height: 1.3;
      font-size: 1.15rem;
    }

    @include viewport_mq6 {
      max-width: 70%;
      line-height: 1.5;
      font-size: 1.2rem;
    }
  }

  &__button-wrapper {
    @include spacing('margin-top', 'xl');
    @include spacing('gap', 'xs');

    display: flex;
    flex-wrap: wrap;
  }

  &__button-app,
  &__button-register {
    width: 100%;

    @include viewport_mq2 {
      width: unset;
    }
  }

  &__button-app {
    @include button-primary;
  }

  &__button-register {
    @include button-secondary;
  }
}
</style>
