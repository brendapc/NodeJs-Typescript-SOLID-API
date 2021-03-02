import { EmailValidation } from "./../../presentation/helpers/validators/email-validation";
import { CompareFieldsValidation } from "./../../presentation/helpers/validators/compare-fields-validation";
import { RequiredFieldValidation } from "./../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "./../../presentation/helpers/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation";
import { Validation } from "./../../presentation/helpers/validators/validation";
import { EmailValidator } from "../../presentation/protocols/email-validator";

jest.mock("./../../presentation/helpers/validators/validation-composite");

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    //STUB (teste double/dublê)
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("Signup validation factory", () => {
  test("should call ValidationComposite with all validations necessary", () => {
    makeSignUpValidation();
    const validations: Validation[] = [];

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    validations.push(new EmailValidation("email", makeEmailValidatorStub()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
