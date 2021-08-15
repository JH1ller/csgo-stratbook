import { defineComponent, onMounted, ref } from '@vue/composition-api';

import styles from './LoaderView.module.scss';

export default defineComponent({
  name: 'loader-view',

  setup() {
    const progress = ref(0);

    onMounted(() => {
      window.ipcService.registerUpdateProgressHandler((updateProgress) => {
        progress.value = updateProgress;
      });
    });

    return {
      progress,
    };
  },

  render() {
    return (
      <div class={styles.loaderView}>
        <p class={styles.loaderView__label}>Downloading updates...</p>
        <div class={styles.loaderView__progressBar}>
          <div class={styles.loaderView__progress_barProgress} style={{ width: `${this.progress}%` }} />
        </div>
      </div>
    );
  },
});
