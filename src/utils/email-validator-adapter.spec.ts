import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";
import { isMainThread } from "worker_threads";
import { EmailValidator } from "../presentation/protocols/email-validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("Email validator adapter", () => {
  test("Should return false if validator returns false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid@mail.com"); //mocka um retorno falso para esta chamada
    expect(isValid).toBe(false);
  });

  test("Should return true if validator returns true", () => {
    const sut = makeSut();
    const isValid = sut.isValid("valid@mail.com");
    expect(isValid).toBe(true);
  });

  test("Should call validator with correct param, email", () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("any@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any@mail.com");
  });
});
