import { InvalidParamError, MissingParamError } from "./../protocols/errors";
import { ServerError } from "./../protocols/errors/server-error";
import { EmailValidator } from "./../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController;
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
const makeEmailValidatorStubWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    //STUB (teste double/dublê)
    isValid(email: string): boolean {
      throw new Error();
    }
  }
  return new EmailValidatorStub();
};
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub); //implementação da classe
  return {
    sut,
    emailValidatorStub,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        email: "any@mail.com",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no password confirmation is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        email: "any@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false); //altera o retorno da função só nesse teste

    const httpRequest = {
      body: {
        name: "any name",
        email: "invalid_mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call email validator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "any name",
        email: "other@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("other@mail.com");
  });
  test("Should return 500 if email validator throws", () => {
    const emailValidatorStub = makeEmailValidatorStubWithError();
    const sut = new SignUpController(emailValidatorStub);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
