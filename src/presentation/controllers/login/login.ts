import {
  serverError,
  unauthorized,
  okRequest,
} from "./../../helpers/http-helper";
import { InvalidParamError } from "../../errors/invalid-param-error";
import { EmailValidator } from "./../../protocols/email-validator";
import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { Authentication } from "../../../domain/usecases/authentication";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authenticationStub: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const accessToken = await this.authenticationStub.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }

      return okRequest({ accessToken });
    } catch (err) {
      return serverError(err);
    }
  }
}
