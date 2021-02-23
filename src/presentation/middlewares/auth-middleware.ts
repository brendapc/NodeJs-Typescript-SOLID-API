import { AccessDeniedError } from "../errors/AccessDeniedError";
import { badRequest } from "./../helpers/http-helper";
import { HttpResponse, HttpRequest } from "./../protocols/http";
import { Middleware } from "./../protocols/middleware";
export class AuthMiddleware implements Middleware {
  async handle(HttpRequest: HttpRequest): Promise<HttpResponse> {
    const error = badRequest(new AccessDeniedError());
    return new Promise((resolve) => resolve(error));
  }
}
