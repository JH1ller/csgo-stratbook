<template>
  <section class="index">
    <Hero class="index__hero" />
  </section>
</template>

<script lang="ts">
export default {
  mounted() {
    console.log(
      `%cHey there, looks like you're a developer checking out stratbook! If you want to have a deeper look, here is a free beta key: %c66D7B36A836090EBB985`,
      `color: #c3c3c3; background: #141418; border: 1px solid #9fd1ff; border-right: none; padding: 2px 8px;`,
      `color: #41b883; background: #141418; border: 1px solid #41b883; padding: 2px 8px;`
    );
  },
};
</script>

<style lang="scss">
.index {
  @include grid(12, true);

  &__hero {
    @include grid-column(12);
  }
}
</style>
