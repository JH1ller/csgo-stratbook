<template>
  <button class="button" :class="typeClass">
    <slot />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Button extends Vue {
  @Prop({ default: 'primary' }) type!: 'primary' | 'secondary';

  private get typeClass(): string {
    return '-' + this.type;
  }
}
</script>

<style lang="scss">
.button {
  @include spacing('padding', 'xs lg');
  @include typo_button;

  border-radius: 6px;
  cursor: pointer;
  border: 2px solid $color--green;
  box-shadow: 0 0 4px rgba($color--black, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &.-primary {
    background-color: $color--green;
    color: $color--white;
  }

  &.-secondary {
    color: $color--green;
    background-color: rgba($color--white, 0.3);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba($color--black, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0 4px rgba($color--black, 0.1);
  }
}
</style>
