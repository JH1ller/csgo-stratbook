<template>
  <section class="faq">
    <div class="faq__wrapper">
      <h1 class="faq__headline">{{ $t('faq.headline') }}</h1>
      <div class="faq__accordions">
        <Accordion
          v-for="(item, index) in $t('faq.questions')"
          :id="index"
          :key="index"
          class="faq__accordion"
          :open="openAccordion === index"
          @toggle="toggleAccordion"
        >
          <template #header>
            {{ item.questionText }}
          </template>
          <template #content>
            {{ item.answerText }}
          </template>
        </Accordion>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Accordion from '@/components/Accordion.vue';

@Component({
  components: {
    Accordion,
  },
})
export default class Faq extends Vue {
  private openAccordion: number | null = null;

  private toggleAccordion(id: number) {
    this.openAccordion = this.openAccordion === id ? null : id;
  }
}
</script>

<style lang="scss">
.faq {
  @include grid(12, true);

  &__wrapper {
    @include grid-column(12, 1);

    display: flex;
    flex-direction: column;
    align-items: center;

    @include viewport_mq5 {
      @include grid-column(6, 4);
    }
  }

  &__headline {
    @include typo_hl3($color--shark);
    @include spacing('margin-bottom', md);

    @include viewport_mq3 {
      @include typo_hl2($color--shark);
      @include spacing('margin-bottom', lg);
    }

    @include viewport_mq6 {
      @include typo_hl1($color--shark);
    }
  }

  &__accordions {
    width: 100%;

    & > :not(:last-of-type) {
      @include spacing('margin-bottom', md);
    }
  }
}
</style>
