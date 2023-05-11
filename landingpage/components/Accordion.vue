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
  background-color: $color--white;
  box-shadow: 3px 3px 6px rgba($color--black, 0.4);

  @include viewport_mq3 {
    @include spacing('padding', md);
  }

  &__header {
    @include typo_hl4($color--shark);

    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @include viewport_mq3 {
      font-size: 1.6rem;
    }
  }

  &__content {
    @include typo_text($color--shark);

    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-out;
    line-height: 1.4;
    overflow: hidden;
    padding: 0;
    opacity: 0;

    #{$root}.-open & {
      @include spacing('padding-top', xs);
      grid-template-rows: 1fr;
      opacity: 1;

      @include viewport_mq3 {
        @include spacing('padding-top', md);
      }
    }

    @include viewport_mq3 {
      font-size: 1.2rem;
    }

    & > div {
      overflow: hidden;
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
