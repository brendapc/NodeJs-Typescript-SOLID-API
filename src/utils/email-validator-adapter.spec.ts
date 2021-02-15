import { EmailValidatorAdapter } from "./email-validator";
import validator from "validator";
import { isMainThread } from "worker_threads";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("Email validator adapter", () => {
  test("Should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid@mail.com"); //mocka um retorno falso para esta chamada
    expect(isValid).toBe(false);
  });

  test("Should return true if validator returns true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid@mail.com");
    expect(isValid).toBe(true);
  });

  test("Should call validator with correct param, email", () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("any@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any@mail.com");
  });
});
