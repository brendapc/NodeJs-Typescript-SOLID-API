import { Validation } from "./../../helpers/validators/validation";
import { okRequest } from "./../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  IAddAccount,
} from "./signup-protocols";
import { badRequest, serverError } from "../../helpers/http-helper";

export class SignUpController implements Controller {
  constructor(
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
