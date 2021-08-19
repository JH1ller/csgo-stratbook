import { defineComponent } from '@vue/composition-api';

import styles from './Loader.module.scss';

export default defineComponent({
  name: 'loader',

  setup() {
    return () => (
      // ? is this still in use staticClass="[data.class, data.staticClass]"
      <div class={styles.loader}>
        <div class={styles.loader__spinner} />
      </div>
    );
  },
});
