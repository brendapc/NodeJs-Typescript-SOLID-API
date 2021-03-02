import { EmailValidation } from "./email-validation";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import { badRequest } from "../http-helper";
import { EmailValidator } from "../../protocols/email-validator";

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    //STUB (teste double/dublê)
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new EmailValidation("email", emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email validation", () => {
  test("Should call email validator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    sut.validate({ email: "any_email@mail.com" });
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should throws if email validator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
