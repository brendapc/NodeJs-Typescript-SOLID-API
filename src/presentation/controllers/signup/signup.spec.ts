import { validator } from "validator";
import { Validation } from "./../../helpers/validators/validation";
import { makeSignUpValidation } from "./../../../main/factories/signup-validation";
import { HttpRequest } from "./../../protocols/http";
import {
  IAddAccount,
  AddAccountModel,
  AccountModel,
  EmailValidator,
} from "./signup-protocols";
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import { SignUpController } from "./signup";
import { resolve } from "path";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: IAddAccount;
  validationStub: Validation;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_mail@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    //STUB (teste double/dublê)
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccountStub = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: account.name,
        email: account.email,
        password: account.password,
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const addAccountStub = makeAddAccountStub();
  const validationStub = makeValidationStub();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    makeSignUpValidation()
  ); //implementação da classe
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        email: "any@mail.com",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no password confirmation is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        email: "any@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if passwordConfirmation isn't equal to password ", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any name",
        email: "any@mail.com",
        password: "any_password",
        passwordConfirmation: "invalid_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false); //altera o retorno da função só nesse teste

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call email validator with correct email", async () => {
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
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("other@mail.com");
  });

  test("Should return 500 if email validator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(null));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(null));
  });

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    });
  });
});
