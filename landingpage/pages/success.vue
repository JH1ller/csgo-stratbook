<template>
  <section class="success">
    <div class="success__wrapper">
      <h1 class="success__headline">{{ $t('register.headline') }}</h1>
      Success
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Success extends Vue {}
</script>

<style lang="scss">
.success {
  @include grid(12, true);

  &__wrapper {
    @include grid-column(12, 1);
    @include blurry-backdrop;

    align-items: center;

    @include viewport_mq2 {
      @include grid-column(10, 2);
    }

    @include viewport_mq3 {
      @include grid-column(8, 3);
    }

    @include viewport_mq4 {
      @include grid-column(6, 4);
    }

    @include viewport_mq7 {
      @include grid-column(4, 5);
    }
  }

  &__headline {
    @include typo_hl3($color--shark);
    @include spacing('margin-bottom', xs);

    @include viewport_mq3 {
      @include typo_hl2($color--shark);
      @include spacing('margin-bottom', lg);
    }

    @include viewport_mq6 {
      @include typo_hl1($color--shark);
    }
  }
}
</style>
