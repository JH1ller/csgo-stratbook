<template>
  <footer class="footer">
    <NuxtLink :to="localePath('index')" class="footer__logo-wrapper">
      <span class="footer__label">stratbook</span>
    </NuxtLink>
    <div class="footer__links">
      <NuxtLink class="footer__link" :to="localePath('legal')">{{
        $t('footer.legalNotice')
      }}</NuxtLink>
      <a
        href="https://twitter.com/csgostratbook"
        class="footer__link --social"
        target="_blank"
        rel="noreferrer"
      >
        <fa-icon :icon="['fab', 'twitter']" />
      </a>
      <a
        href="https://github.com/JH1ller/csgo-stratbook"
        target="_blank"
        rel="noreferrer"
        class="footer__link --social"
      >
        <fa-icon :icon="['fab', 'github']" />
      </a>
      <a
        href="https://ko-fi.com/Q5Q02X2XQ"
        rel="noreferrer"
        target="_blank"
        class="footer__link"
        ><img
          height="36"
          src="https://cdn.ko-fi.com/cdn/kofi5.png?v=2"
          alt="Buy Me a Coffee at ko-fi.com"
      /></a>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss">
.footer {
  @include grid(12, true);
  @include spacing('padding-top', 'md');
  @include spacing('padding-bottom', 'xs');

  background-color: $color--abbey;

  @include viewport_mq2 {
    @include spacing('padding-top', 'md');
    @include spacing('padding-bottom', 'md');
  }

  @include viewport_mq3 {
    @include spacing('padding-top', 'md');
    @include spacing('padding-bottom', 'md');
  }

  &__logo-wrapper {
    @include grid-column(6, 1);
    @include spacing('margin-bottom', 'md');

    cursor: pointer;
    align-self: center;
    display: flex;
    align-items: center;

    @include viewport_mq3 {
      @include grid-column(3, 1);

      margin-bottom: 0;
    }

    @include viewport_mq5 {
      @include grid-column(3, 3);
    }
  }

  &__label {
    @include typo_logo($color--white);

    font-size: 1.5rem;
  }

  &__links {
    @include grid-column(12, 1);

    display: flex;
    flex-direction: column;

    color: $color--white;

    @include viewport_mq3 {
      @include grid-column(9, 4);

      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }

    @include viewport_mq5 {
      @include grid-column(4, 7);
    }
  }

  &__link {
    @include typo_link($color--white);
    @include spacing('margin-bottom', 'xs');

    font-size: 1.1rem;
    white-space: nowrap;
    opacity: 0.5;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }

    &.--social {
      display: flex;

      & > svg {
        width: 24px;

        @include viewport_mq6 {
          width: 28px;
        }
      }
    }

    @include viewport_mq3 {
      @include spacing('margin-left', 'md');

      margin-bottom: 0;
    }

    @include viewport_mq6 {
      @include spacing('margin-left', '2xl');
    }
  }
}
</style>
