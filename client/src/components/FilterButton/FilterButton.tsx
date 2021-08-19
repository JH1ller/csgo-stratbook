import { defineComponent, ref } from '@vue/composition-api';

import FloatingButton from '@/components/FloatingButton/FloatingButton.vue';

import './FilterButton.scss';

export default defineComponent({
  name: 'filter-button',

  emits: {
    click: () => true,
  },

  setup(_props, { emit }) {
    const activeFilterCount = ref(0);

    const onClickHandle = () => {
      emit('click');
    };

    return {
      activeFilterCount,

      onClickHandle,
    };
  },

  render() {
    return (
      <div class="filter-button">
        <FloatingButton class="filter-button__button" icon="filter" label="Filter" onClick={this.onClickHandle} />

        {this.activeFilterCount && <span class="filter-button__indicator">{this.activeFilterCount}</span>}
      </div>
    );
  },
});
