import { Validation } from "../../../../presentation/protocols/validation";
import {
  ValidationComposite,
  RequiredFieldValidation,
} from "../../../../validation/validators";

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = [];

  for (const field of ["question", "answers"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
