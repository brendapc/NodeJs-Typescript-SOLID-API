import { ILoadAccountByToken } from "./../../domain/usecases/load-accountby-token";
import { badRequest, okRequest, serverError } from "./../helpers/http-helper";
import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "./../protocols/http";
import { AccessDeniedError } from "../errors/AccessDeniedError";
import { AccountModel } from "../../domain/models/account";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: ILoadAccountByToken;
}
const makeFakeAccount = () => {
  return {
    id: "id",
    name: "name",
    email: "email",
    password: "password",
  };
};

const makeFakeRequest = () => {
  return {
    headers: {
      "x-access-token": "any_token",
    },
  };
};

const makeLoadAccountbyToken = (): ILoadAccountByToken => {
  class LoadAccountByTokenStub implements ILoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return new Promise((resolve) => resolve(account));
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountbyToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
};

describe("Auth Middlware", () => {
  test("should return 403 if no token id found in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new AccessDeniedError()));
  });

  test("should call LoadAccountByToken with correct accessToken", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest = {
      headers: {
        "x-access-token": "any_token",
      },
    };
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(
      httpRequest.headers["x-access-token"],
      role
    );
  });

  test("should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new AccessDeniedError()));
  });

  test("should return 200 if LoadAccountByToken returns an account", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      headers: {
        "x-access-token": "any_token",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(okRequest({ accountId: "id" }));
  });

  test("should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
