import { ILoadAccountByToken } from "../../domain/usecases/load-accountby-token";
import { AccessDeniedError } from "../errors/AccessDeniedError";
import { badRequest, okRequest } from "./../helpers/http-helper";
import { HttpResponse, HttpRequest } from "./../protocols/http";
import { Middleware } from "./../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken);
      if (account) {
        return okRequest({ accountId: account.id });
      }
    }
    const error = badRequest(new AccessDeniedError());
    return error;
  }
}
