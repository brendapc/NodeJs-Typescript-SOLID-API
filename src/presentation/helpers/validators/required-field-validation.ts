import { MissingParamError } from "../../errors";
import { Validation } from "./validation";
export class RequiredFieldValidation implements Validation {
  constructor(private readonly filedName: string) {}

  validate(input: any): Error {
    if (!input[this.filedName]) {
      return new MissingParamError(this.filedName);
    }
  }
}
