import { InvalidParamError, MissingParamError } from "./../protocols/errors";
import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
} from "./../protocols";
import { badRequest, serverError } from "./../helpers/http-helper";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (err) {
      return serverError();
    }
  }
}
