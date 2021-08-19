import { computed, defineComponent, PropType, toRefs } from '@vue/composition-api';
import FormField from 'src/utils/FormField';

import './TextInput.scss';

export default defineComponent({
  name: 'text-input',

  props: {
    field: {
      type: Object as PropType<FormField>,
      required: true,
    },

    name: {
      type: String,
      default: 'inputName',
    },

    type: {
      type: String,
      default: 'text',
    },
  },

  emits: {
    input: () => true,
    focus: () => true,
  },

  setup(props, { emit }) {
    const { field, name, type } = toRefs(props);

    const formattedLabel = computed(() => (field.value.required ? `${field.value.label}*` : field.value.label));

    const onInput = (e: InputEvent) => {
      const target = e.target as HTMLInputElement;

      emit('input', target.value);
    };

    const onFocus = () => {
      emit('focus');
    };

    return {
      // !needs to be rebound in vue2
      inputType: type,
      inputName: name,
      inputField: field,

      formattedLabel,

      onInput,
      onFocus,
    };
  },

  render() {
    return (
      <div class="text-input">
        <input
          autocomplete={this.field.autocompleteTag || 'nope'}
          class={[
            'text-input__input',
            {
              '-has-content': this.field.value,
              '-error': this.field.errors.length,
            },
          ]}
          name={this.inputName}
          onFocus={this.onFocus}
          onInput={this.onInput}
          type={this.inputType}
          value={this.field.value}
        />

        <span class="text-input__label">{this.formattedLabel}</span>

        <transition name="fade">
          {this.field.errors.length && <span class="text-input__error">{this.field.errors[0]}</span>}
        </transition>
      </div>
    );
  },
});
