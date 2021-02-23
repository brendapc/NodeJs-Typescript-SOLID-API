import { badRequest } from "./../helpers/http-helper";
import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "./../protocols/http";
import { AccessDeniedError } from "../errors/AccessDeniedError";

describe("Auth Middlware", () => {
  test("should return 403 if no token id found in headers", async () => {
    const sut = new AuthMiddleware();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new AccessDeniedError()));
  });
});
