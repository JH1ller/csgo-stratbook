import FormField, { FormFieldData } from './FormField';

export const validateForm = (formData: Record<string, FormField>): boolean => {
  let valid = true;

  const fields = Object.entries(formData);

  fields.forEach(([fieldName, field]) => {
    if (!field.validate()) {
      valid = false;
    }
  });

  return valid;
};

// TODO: deprecated -> remove
export const validate = (data: FormFieldData): boolean => {
  return data.validators.every(validator => validator(data));
};

export type ValidatorFunction = (data: FormFieldData) => boolean;

export class Validators {
  private static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private static pwRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
  private static numberRegex = /^\d+$/;
  private static urlRegex = /(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/;
  private static youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

  static notEmpty(): ValidatorFunction {
    const errorMessage = 'Field cannot be empty.';
    return data => {
      const result = data.required ? data.value.length > 0 : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static exactLength(length: number): ValidatorFunction {
    const errorMessage = `Must be at exactly ${length} characters long.`;
    return data => {
      const result = data.required
        ? data.value.length === length
        : data.value.length
        ? data.value.length === length
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static minLength(minLength: number): ValidatorFunction {
    const errorMessage = `Must be at least ${minLength} characters.`;
    return data => {
      const result = data.required
        ? data.value.length >= minLength
        : data.value.length
        ? data.value.length >= minLength
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static maxLength(maxLength: number): ValidatorFunction {
    const errorMessage = `Must be a maximum of ${maxLength} characters.`;
    return data => {
      const result = data.required
        ? data.value.length <= maxLength
        : data.value.length
        ? data.value.length <= maxLength
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static isEmail(): ValidatorFunction {
    const errorMessage = `Must be a valid email address.`;
    return data => {
      const result = data.required
        ? this.emailRegex.test(data.value)
        : data.value.length
        ? this.emailRegex.test(data.value)
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static isURL(): ValidatorFunction {
    const errorMessage = `Must be a valid URL.`;
    return data => {
      const result = data.required
        ? this.urlRegex.test(data.value)
        : data.value.length
        ? this.urlRegex.test(data.value)
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static isSufficientPw(): ValidatorFunction {
    const errorMessage = `Must be include lower-case, upper-case and number`;
    return data => {
      const result = data.required
        ? this.pwRegex.test(data.value)
        : data.value.length
        ? this.pwRegex.test(data.value)
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static isYoutubeLink(): ValidatorFunction {
    const errorMessage = `Currently only youtube is supported.`;
    return data => {
      const expressionResult = data.value.match(this.youtubeRegex)?.[7]?.length === 11;
      const result = data.required ? expressionResult : data.value.length ? expressionResult : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static isNumber(): ValidatorFunction {
    const errorMessage = `Must be a number.`;
    return data => {
      const result = data.required
        ? this.numberRegex.test(data.value)
        : data.value.length
        ? this.numberRegex.test(data.value)
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static isPartOf(list: unknown[]): ValidatorFunction {
    const errorMessage = `Must be one of the following options: ${list.join(', ')}`;
    return data => {
      const result = data.required ? list.includes(data.value) : data.value.length ? list.includes(data.value) : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }

  static matches(fieldRef: FormField): ValidatorFunction {
    const errorMessage = `Value does not match.`;
    return data => {
      const result = data.required
        ? data.value === fieldRef.value
        : data.value.length
        ? data.value === fieldRef.value
        : true;
      if (!result) {
        data.errors.push(errorMessage);
      } else {
        data.errors = data.errors.filter(msg => msg !== errorMessage);
      }
      return result;
    };
  }
}
