<template>
  <div :id="id" class="accordion" :class="{ '-open': open }" @click="toggle">
    <div class="accordion__header">
      <slot name="header" />
      <fa-icon icon="angle-down" class="accordion__icon"></fa-icon>
    </div>
    <div class="accordion__content">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Accordion extends Vue {
  @Prop({ default: false }) open!: boolean;
  @Prop({ default: Date.now().toString() }) id!: string;

  @Emit()
  private toggle() {
    return this.id;
  }
}
</script>

<style lang="scss">
.accordion {
  $root: &;

  @include spacing('padding', xs);

  cursor: pointer;
  width: 100%;
  border-radius: 8px;
  background-color: var(--color-bg);
  box-shadow: 3px 3px 6px rgba(black, 0.4);

  @include viewport_mq3 {
    @include spacing('padding', md);
  }

  &__header {
    @include typo_hl4(var(--color-text));

    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @include viewport_mq3 {
      font-size: 1.6rem;
    }
  }

  &__content {
    @include typo_text(var(--color-text));
    @include spacing('padding-top', xs);

    line-height: 1.4;
    display: none;
    overflow: hidden;

    #{$root}.-open & {
      display: block;
    }

    @include viewport_mq3 {
      @include spacing('padding-top', md);

      font-size: 1.2rem;
    }
  }

  &__icon {
    transition: transform 0.2s ease-out;
    transform: rotate(0);
    width: 16px;

    #{$root}.-open & {
      transform: rotate(180deg);
    }
  }
}
</style>
