import { defineComponent, PropType, toRefs } from '@vue/composition-api';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import './ConfirmDialog.scss';

export default defineComponent({
  name: 'confirm-dialog',

  props: {
    text: {
      type: String,
      required: true,
    },

    resolve: {
      type: Function as PropType<(result: boolean) => void>,
      required: true,
    },

    resolveBtn: {
      type: String,
      default: 'Confirm',
    },

    rejectBtn: {
      type: String,
      default: 'Cancel',
    },

    confirmOnly: {
      type: Boolean,
      default: false,
    },

    htmlMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    close: () => true,
  },

  setup(props, { emit }) {
    const { text, resolveBtn, rejectBtn, confirmOnly, htmlMode } = toRefs(props);

    const onClickedConfirm = () => {
      props.resolve(true);

      emit('close');
    };

    const onClickedCancel = () => {
      props.resolve(false);

      emit('close');
    };

    return {
      // !has to be rebound in vue 2 :(
      dialogText: text,
      resolveButton: resolveBtn,
      rejectButton: rejectBtn,
      dialogConfirmOnly: confirmOnly,
      dialogHtmlMode: htmlMode,

      onClickedConfirm,
      onClickedCancel,
    };
  },

  render() {
    return (
      <div class="confirm-dialog">
        <div class="confirm-dialog__window">
          {this.dialogHtmlMode ? (
            <p class="confirm-dialog__text" domPropsInnerHTML={this.dialogText} />
          ) : (
            <p class="confirm-dialog__text">{this.dialogText}</p>
          )}

          <div class="confirm-dialog__buttons">
            <button class="confirm-dialog__btn-confirm" onClick={this.onClickedConfirm}>
              <FontAwesomeIcon icon="check" />
              {this.resolveButton}
            </button>

            {!this.dialogConfirmOnly && (
              <button class="confirm-dialog__btn-cancel" onClick={this.onClickedCancel}>
                <FontAwesomeIcon icon="ban" />
                {this.rejectButton}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
});
