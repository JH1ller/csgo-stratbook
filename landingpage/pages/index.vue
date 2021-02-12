<template>
  <section class="index">
    <Hero class="index__hero" />
  </section>
</template>

<script lang="ts">
export default {
  mounted() {
    console.log(
      `%cHey there, looks like you're a developer checking out stratbook! If you find any bugs or just want help to improve stratbook, feel free to open issues and submit PR's on Github: https://github.com/JH1ller/csgo-stratbook`,
      `color: #c3c3c3; background: #141418; border: 1px solid #9fd1ff; border-right: none; padding: 2px 8px;`
    );
  }
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
