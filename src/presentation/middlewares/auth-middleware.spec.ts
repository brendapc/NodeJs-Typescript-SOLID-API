import { response } from "express";
import { AccountModel } from "../../domain/models/account";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbbiden } from "./../helpers/http/http-helper";
import { HttpRequest } from "./../protocols/http";
import { AuthMiddleware } from "./auth-middleware";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

describe("Auth Middleware", () => {
  test("should return 403 if no x-access-token exists in headers", async () => {
    const sut = new AuthMiddleware();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()));
  });

  test("should call LoadAccountByToken with correct x-access-token", async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(accessToken: string, role?: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(makeFakeAccount()));
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    await sut.handle({
      headers: {
        "x-access-token": "any_token",
      },
    });
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});
