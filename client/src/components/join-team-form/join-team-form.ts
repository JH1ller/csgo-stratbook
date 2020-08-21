import { Component, Vue, Ref } from 'vue-property-decorator';
import { FormComponent } from '@/interfaces/index';

@Component({})
export default class JoinTeamForm extends Vue implements FormComponent {
  @Ref('code') codeInput!: HTMLInputElement;
  private formMessage: string | null = null;
  private formMessageStyle: string | null = null;
  private code: string = '';

  get isError() {
    return this.formMessageStyle === 'error';
  }

  get isSuccess() {
    return this.formMessageStyle === 'success';
  }

  private validateForm(): boolean {
    if (this.codeInput.value.length !== 6) {
      this.updateFormMessage('Please enter a valid join code.', 'error');
      return false;
    }
    return true;
  }

  private joinClicked(e: Event) {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.$emit('join-clicked', this.code.toLowerCase());
  }

  public updateFormMessage(message: string | null, style: string | null) {
    this.formMessage = message;
    this.formMessageStyle = style;
  }
}
