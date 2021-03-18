import { Validation } from "./../../../../protocols/validation";
import { HttpRequest, HttpResponse } from "./add-survey-controller-protocols";
import { Controller } from "./../../../../protocols/controller";

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);
    return new Promise((resolve) => resolve(null));
  }
}
