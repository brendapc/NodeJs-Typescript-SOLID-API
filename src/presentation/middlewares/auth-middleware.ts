import { LoadAccountByToken } from "./../../domain/usecases/load-account-by-token";
import { forbbiden, ok, serverError } from "./../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "./../protocols/http";
import { Middleware } from "./../protocols/middleware";
import { AccessDeniedError } from "../errors";
export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];

      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        );
        if (account) return ok({ accountId: account.id });
      }
      return forbbiden(new AccessDeniedError());
    } catch (err) {
      return serverError(err);
    }
  }
}
