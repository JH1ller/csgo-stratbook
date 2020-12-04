export interface FormFieldData {
  label: string;
  required: boolean;
  value: string;
  hasError: boolean;
  autocompleteTag?: string;
  validators: ValidatorFunction[];
}

export const validate = (data: FormFieldData): boolean => {
  return data.validators.every(validator => validator(data));
};

export type ValidatorFunction = (data: FormFieldData) => boolean;

export class Validators {
  private static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private static numberRegex = /^\d+$/;
  private static urlRegex = /(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/;

  static notEmpty(): ValidatorFunction {
    return data => {
      return data.required ? data.value.length > 0 : true;
    };
  }

  static minLength(minLength: number): ValidatorFunction {
    return data => {
      return data.required ? data.value.length >= minLength : data.value.length ? data.value.length >= minLength : true;
    };
  }

  static maxLength(maxLength: number): ValidatorFunction {
    return data => {
      return data.required ? data.value.length <= maxLength : data.value.length ? data.value.length <= maxLength : true;
    };
  }

  static isEmail(): ValidatorFunction {
    return data => {
      return data.required
        ? this.emailRegex.test(data.value)
        : data.value.length
        ? this.emailRegex.test(data.value)
        : true;
    };
  }

  static isURL(): ValidatorFunction {
    return data => {
      return data.required ? this.urlRegex.test(data.value) : data.value.length ? this.urlRegex.test(data.value) : true;
    };
  }

  static isNumber(): ValidatorFunction {
    return data => {
      return data.required
        ? this.numberRegex.test(data.value)
        : data.value.length
        ? this.numberRegex.test(data.value)
        : true;
    };
  }

  static isPartOf(list: unknown[]): ValidatorFunction {
    return data => {
      return data.required ? list.includes(data.value) : data.value.length ? list.includes(data.value) : true;
    };
  }
}
