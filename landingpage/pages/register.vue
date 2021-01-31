<template>
  <section class="register">
    <div class="register__wrapper">
      <h1 class="register__headline">{{ $t('register.headline') }}</h1>
      <RegisterForm @submit="submit" :formError="errorMsg" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RegisterForm from '@/components/RegisterForm/RegisterForm.vue';

@Component({
  components: {
    RegisterForm,
  },
})
export default class Register extends Vue {
  private errorMsg: string = '';
  private async submit(formData: FormData) {
    try {
      // TODO: do this nice and properly
      await (this as any).$axios.post(
        'https://api.stratbook.live/auth/register',
        formData
      );
      // eslint-disable-next-line no-undef
      (this as any).$router.push(localeRoute({ name: 'success' }));
    } catch (error) {
      this.errorMsg = error.response?.data?.error;
    }
  }
}
</script>

<style lang="scss">
.register {
  @include grid(12, true);

  &__wrapper {
    @include grid-column(12, 1);
    @include blurry-backdrop;

    align-items: center;

    @include viewport_mq2 {
      @include grid-column(10, 2);
    }

    @include viewport_mq3 {
      @include grid-column(8, 3);
    }

    @include viewport_mq4 {
      @include grid-column(6, 4);
    }

    @include viewport_mq7 {
      @include grid-column(4, 5);
    }
  }

  &__headline {
    @include typo_hl3($color--shark);
    @include spacing('margin-bottom', xs);

    @include viewport_mq3 {
      @include typo_hl2($color--shark);
      @include spacing('margin-bottom', lg);
    }

    @include viewport_mq6 {
      @include typo_hl1($color--shark);
    }
  }
}
</style>
