import { okRequest } from "./../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../protocols/errors";
import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
  IAddAccount,
} from "./signup-protocols";
import { badRequest, serverError } from "../../helpers/http-helper";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private addAccount: IAddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError("email"));
      }

      const createdAccount = await this.addAccount.add({
        name,
        email,
        password,
      });

      return okRequest(createdAccount); //id, name, email, password
    } catch (err) {
      return serverError();
    }
  }
}
