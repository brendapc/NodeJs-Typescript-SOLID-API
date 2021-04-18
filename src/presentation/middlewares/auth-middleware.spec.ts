import { LoadAccountByToken } from "../../domain/usecases/account/load-account-by-token";
import { AccountModel } from "../../domain/models/account";
import { AccessDeniedError } from "../errors";
import { forbbiden, ok, serverError } from "./../helpers/http/http-helper";
import { HttpRequest } from "./../protocols/http";
import { AuthMiddleware } from "./auth-middleware";

interface SutTypes {
  loadAccountByTokenStub: LoadAccountByToken;
  sut: AuthMiddleware;
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};
const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe("Auth Middleware", () => {
  test("should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()));
  });

  test("should call LoadAccountByToken with correct x-access-token", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token", role);
  });

  test("should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()));
  });

  test("should return 200 if LoadAccountByToken returns account", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accountId: "any_id" }));
  });

  test("should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockImplementationOnce(()=> { throw new Error()});
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
