import { defineComponent } from '@vue/composition-api';

import styles from './BackdropDialog.module.scss';

export default defineComponent({
  name: 'backdrop-dialog',

  setup(_props, { slots }) {
    return () => (
      <div class={styles.backdropDialog}>
        <div class={styles.backdropDialog__content}>{slots?.default?.()}</div>
      </div>
    );
  },
});
