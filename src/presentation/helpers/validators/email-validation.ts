import { EmailValidator } from "../../protocols/email-validator";
import { InvalidParamError } from "./../../errors/invalid-param-error";
import { Validation } from "./validation";

export class EmailValidation implements Validation {
  constructor(
      private readonly filedName: string,
    private readonly emailValidator: EmailValidator,

  ) {}

  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.filedName]);
    if (!isValid) {
      return new InvalidParamError(this.filedName);
    }
  }
}
