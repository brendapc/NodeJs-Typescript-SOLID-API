import { forbbiden } from "./../helpers/http/http-helper";
import { resolve } from "node:path";
import { HttpRequest, HttpResponse } from "./../protocols/http";
import { Middleware } from "./../protocols/middleware";
import { AccessDeniedError } from "../errors";
export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) =>
      resolve(forbbiden(new AccessDeniedError()))
    );
  }
}
