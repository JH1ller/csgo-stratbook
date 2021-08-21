import { defineComponent, ref } from '@vue/composition-api';

import { COOKIE_BASE_DOMAIN } from 'src/config';

import styles from './CookieBanner.module.scss';

export default defineComponent({
  name: 'cookie-banner',

  emits: {
    close: () => true,
  },

  setup(_props, { emit }) {
    const analyticsChecked = ref(false);

    const setCookie = (key: string, value: string) => {
      document.cookie = `${key}=${value}; domain=${COOKIE_BASE_DOMAIN}; max-age=31536000; path=/`;
    };

    const onClickSave = () => {
      setCookie('bannerShown', 'true');
      setCookie('allowAnalytics', analyticsChecked.value.toString());

      emit('close');
    };

    const onClickAccept = () => {
      setCookie('bannerShown', 'true');
      setCookie('allowAnalytics', 'true');

      emit('close');
    };

    return {
      analyticsChecked,

      onClickSave,
      onClickAccept,
    };
  },

  render() {
    return (
      <div class={styles.cookieBanner}>
        <p class={styles['cookieBanner__base-text']}>
          We use necessary cookies to make our site work. With your approval we might also set up optional analytics
          cookies to help us improve the site.
        </p>
        <div class={styles.cookieBanner__options}>
          <input checked class={styles.cookieBanner__checkbox} disabled id="requiredCookie" type="checkbox" />
          <label class={styles.cookieBanner__checkboxLabel} for="requiredCookie">
            Required cookies
          </label>
          <input
            class={styles.cookieBanner__checkbox}
            id="analyticsCookie"
            type="checkbox"
            vModel={this.analyticsChecked}
          />
          <label class={styles.cookieBanner__checkboxLabel} for="analyticsCookie">
            Analytics cookies
          </label>
        </div>
        <div class={styles.cookieBanner__btnWrapper}>
          <button class={[styles.cookieBanner__btn, '--save']} onClick={this.onClickSave}>
            Save
          </button>
          <button class={[styles.cookieBanner__btn, '--accept']} onClick={this.onClickAccept}>
            Accept all
          </button>
        </div>
      </div>
    );
  },
});
