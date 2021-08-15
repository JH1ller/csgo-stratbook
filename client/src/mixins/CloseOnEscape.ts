import { Component, Emit, Vue } from 'vue-property-decorator';

@Component
export default class CloseOnEscape extends Vue {
  private beforeMount() {
    document.addEventListener('keydown', this.__keydownHandler);
  }

  private beforeDestroy() {
    document.removeEventListener('keydown', this.__keydownHandler);
  }

  private __keydownHandler({ key }: KeyboardEvent) {
    if (key === 'Escape') {
      this.close();
    }
  }

  @Emit()
  public close() {
    //
  }
}
