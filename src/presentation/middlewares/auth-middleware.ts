import { LoadAccountByToken } from "./../../domain/usecases/load-account-by-token";
import { forbbiden } from "./../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "./../protocols/http";
import { Middleware } from "./../protocols/middleware";
import { AccessDeniedError } from "../errors";
export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];

    if (accessToken) {
      this.loadAccountByToken.load(accessToken);
    } else {
      return new Promise((resolve) =>
        resolve(forbbiden(new AccessDeniedError()))
      );
    }
  }
}
