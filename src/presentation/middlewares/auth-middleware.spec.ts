import { AccessDeniedError } from "../errors";
import { forbbiden } from "./../helpers/http/http-helper";
import { HttpRequest } from "./../protocols/http";
import { AuthMiddleware } from "./auth-middleware";

describe("Auth Middleware", () => {
  test("should return 403 if no x-access-token exists in headers", async () => {
    const sut = new AuthMiddleware();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()));
  });
});
