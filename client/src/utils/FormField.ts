import { ValidatorFunction } from './validation';

export interface FormFieldData {
  label: string;
  required: boolean;
  value: string;
  errors: string[];
  autocompleteTag?: string;
  validators: ValidatorFunction[];
}

export default class FormField implements FormFieldData {
  private _value = '';
  public label!: string;
  public required = false;
  public errors: string[] = [];
  public autocompleteTag = 'off';
  public validators: ValidatorFunction[] = [];

  constructor(label: string, required: boolean, validators: ValidatorFunction[], autocompleteTag?: string) {
    this.label = label;
    this.required = required;
    this.autocompleteTag = autocompleteTag ?? 'off';
    this.validators = validators;
  }

  public get value() {
    return this._value;
  }

  public set value(value: string) {
    if (this.errors.length && value) {
      this.clearErrors();
    }
    this._value = value;
  }

  public validate(): boolean {
    return this.validators.every(validator => validator(this));
  }

  public clearErrors(): void {
    this.errors = [];
  }
}
