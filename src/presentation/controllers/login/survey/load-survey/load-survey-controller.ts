import { serverError } from "./../../../../helpers/http/http-helper";
import { ok } from "../../../../helpers/http/http-helper";
import { ILoadSurveys } from "./../../../../../domain/usecases/load-surveys";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "./load-survey-controller-protocols";
export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: ILoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return ok(surveys);
    } catch (err) {
      return serverError(err);
    }
  }
}
