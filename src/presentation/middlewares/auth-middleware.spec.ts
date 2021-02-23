import { resolve } from "path";
import { ILoadAccountByToken } from "./../../domain/usecases/load-accountby-token";
import { badRequest } from "./../helpers/http-helper";
import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "./../protocols/http";
import { AccessDeniedError } from "../errors/AccessDeniedError";
import { AccountModel } from "../../domain/models/account";

describe("Auth Middlware", () => {
  test("should return 403 if no token id found in headers", async () => {
    class LoadAccountByToken implements ILoadAccountByToken {
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

    const loadAccountByTokenStub = new LoadAccountByToken();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new AccessDeniedError()));
  });

  test("should call LoadAccountByToken with correct accessToken", async () => {
    class LoadAccountByToken implements ILoadAccountByToken {
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

    const loadAccountByTokenStub = new LoadAccountByToken();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const httpRequest = {
      headers: {
        "x-access-token": "any_token",
      },
    };
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers["x-access-token"]);
  });
});
