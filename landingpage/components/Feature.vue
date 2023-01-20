<template>
  <div class="feature">
    <div class="feature__text-content">
      <div class="feature__title-wrapper">
        <fa-icon :icon="feature.icon" class="feature__icon"></fa-icon>
        <h2 class="feature__title">{{ feature.title }}</h2>
      </div>
      <span class="feature__description-highlight"
        >{{ feature.descriptionHighlight }}
      </span>
      <span class="feature__description"> {{ feature.description }}</span>
    </div>
    <img
      :src="require(`@/assets/images/webp/${feature.image}.webp`)"
      :alt="`${feature.title} screenshot`"
      class="feature__screenshot"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface FeatureItem {
  title: string;
  descriptionHighlight: string;
  description: string;
  image: string;
  icon: string;
}

@Component({})
export default class Hero extends Vue {
  @Prop() feature!: FeatureItem;
}
</script>

<style lang="scss">
.feature {
  @include spacing('gap', '2xl');

  &__screenshot {
    @include spacing('margin-top', 'xl');

    width: 100%;
    border-radius: 12px;
    box-shadow: -1px 0 0px 0 var(--color-accent-20),
      0px 0px 28px 0 var(--color-accent-20);
  }

  &__icon {
    color: var(--color-text-contrast);
    width: 24px;
  }

  &__title-wrapper {
    @include spacing('gap', 's');
    @include spacing('margin-bottom', 's');
    display: flex;
    align-items: center;
  }

  &__title {
    @include typo_hl5(var(--color-text-contrast));
  }

  &__text-content {
    max-width: 80%;
  }

  &__description {
    @include typo_hl4(var(--color-text-contrast-70));

    @include viewport_mq6 {
      @include typo_text-large(var(--color-text-contrast));
    }
  }

  &__description-highlight {
    @include typo_hl4(var(--color-green));

    @include viewport_mq6 {
      @include typo_text-large(var(--color-green));
    }
    text-shadow: 0 0 8px var(--color-blue-10), 0 0 24px rgba(0, 0, 0, 0.5);
  }
}
</style>
