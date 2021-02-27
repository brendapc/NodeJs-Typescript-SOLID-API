import { InvalidParamError } from "./../../errors/invalid-param-error";
import { Validation } from "./validation";

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly filedName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate(input: any): Error {
    if (input[this.filedName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
