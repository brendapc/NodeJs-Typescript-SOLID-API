import { RequiredFieldValidation } from "./../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "./../../presentation/helpers/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation";
import { Validation } from "./../../presentation/helpers/validators/validation";

jest.mock("./../../presentation/helpers/validators/validation-composite");

describe("Signup validation factory", () => {
  test("should call ValidationComposite with all validations necessary", () => {
    makeSignUpValidation();
    const validations: Validation[] = [];

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
