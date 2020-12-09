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
  public label!: string;
  public required: boolean = false;
  public value: string = '';
  public errors: string[] = [];
  public autocompleteTag: string = 'off';
  public validators: ValidatorFunction[] = [];

  constructor(label: string, required: boolean, validators: ValidatorFunction[], autocompleteTag?: string) {
    this.label = label;
    this.required = required;
    this.autocompleteTag = autocompleteTag ?? 'off';
    this.validators = validators;
  }

  public validate(): boolean {
    return this.validators.every(validator => validator(this));
  }

  public clearErrors(): void {
    this.errors = [];
  }
}
