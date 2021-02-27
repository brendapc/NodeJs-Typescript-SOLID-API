import { Validation } from "./../../helpers/validators/validation";
import { okRequest } from "./../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../errors";
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
    private addAccount: IAddAccount,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = httpRequest.body;

     

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      const createdAccount = await this.addAccount.add({
        name,
        email,
        password,
      });

      return okRequest(createdAccount); //id, name, email, password
    } catch (err) {
      return serverError(err);
    }
  }
}
