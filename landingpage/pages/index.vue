<template>
  <section class="index">
    <Hero class="index__hero" />
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss">
.index {
  @include grid(12, true);

  &__hero {
    @include grid-column(12);
  }
}
</style>
