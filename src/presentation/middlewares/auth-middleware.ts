import { ILoadAccountByToken } from "../../domain/usecases/load-accountby-token";
import { AccessDeniedError } from "../errors/AccessDeniedError";
import { badRequest } from "./../helpers/http-helper";
import { HttpResponse, HttpRequest } from "./../protocols/http";
import { Middleware } from "./../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }
    const error = badRequest(new AccessDeniedError());
    return error;
  }
}
