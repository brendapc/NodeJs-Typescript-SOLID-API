import { ILoadAccountByToken } from "./../../domain/usecases/load-accountby-token";
import { badRequest, okRequest } from "./../helpers/http-helper";
import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "./../protocols/http";
import { AccessDeniedError } from "../errors/AccessDeniedError";
import { AccountModel } from "../../domain/models/account";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: ILoadAccountByToken;
}

const makeLoadAccountbyToken = (): ILoadAccountByToken => {
  class LoadAccountByTokenStub implements ILoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      const account = {
        id: "id",
        name: "name",
        email: "email",
        password: "password",
      };
      return new Promise((resolve) => resolve(account));
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountbyToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return { sut, loadAccountByTokenStub };
};

describe("Auth Middlware", () => {
  test("should return 403 if no token id found in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new AccessDeniedError()));
  });

  test("should call LoadAccountByToken with correct accessToken", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest = {
      headers: {
        "x-access-token": "any_token",
      },
    };
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers["x-access-token"]);
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
});
