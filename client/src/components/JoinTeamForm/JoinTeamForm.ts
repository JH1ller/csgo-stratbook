import { Component, Vue, Ref, Prop, Emit } from 'vue-property-decorator';

@Component({})
export default class JoinTeamForm extends Vue {
  @Ref('code') codeInput!: HTMLInputElement;
  @Prop() private formError!: string;
  private code: string = '';

  private validateForm(): boolean {
    if (this.codeInput.value.length !== 6) {
      this.updateFormError('Please enter a valid join code.');
      return false;
    }
    return true;
  }

  @Emit()
  private updateFormError(text: string) {
    return text;
  }

  private joinClicked(e: Event) {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.$emit('join-clicked', this.code.toLowerCase());
  }
}
