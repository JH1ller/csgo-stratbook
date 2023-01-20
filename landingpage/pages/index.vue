<template>
  <div class="index">
    <section class="index__hero">
      <Hero />
    </section>
    <section class="index__features">
      <!-- <h2 class="index__features-headline">{{ $t('features.headline') }}</h2> -->
      <Feature
        v-for="item in $t('features.items')"
        :feature="item"
        :key="item.title"
      />
    </section>
  </div>
</template>

<script lang="ts">
export default {
  mounted() {
    console.log(
      `%cHey there, looks like you're a developer checking out stratbook! If you find any bugs or just want help to improve stratbook, feel free to open issues and submit PR's on Github: https://github.com/JH1ller/csgo-stratbook`,
      `color: #c3c3c3; background: #141418; border: 1px solid #9fd1ff; border-right: none; padding: 2px 8px;`
    );
  },
};
</script>

<style lang="scss">
.index {
  @include grid(12, true);

  & > * {
    &:not(:first-child) {
      @include spacing('margin-top', '3xl');
    }
  }

  &__hero {
    @include grid-column(12);
  }

  &__features {
    @include grid-column(12);

    @include viewport_mq3 {
      @include grid-column(8, 3);
    }

    & > *:not(:first-child) {
      @include spacing('margin-top', '4xl');
    }

    & > *:not(:last-child) {
      @include spacing('padding-bottom', 'xl');
    }
  }

  &__features-headline {
    @include page-headline;
    @include typo_hl1(var(--color-text-contrast-70));
  }
}
</style>
