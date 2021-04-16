import { LoadSurveyById } from './../../../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest, HttpResponse } from '../../add-survey/add-survey-controller-protocols';
import { Controller } from './../../../../../protocols/controller';

export class SaveSurveyResultController implements Controller{
    constructor(private readonly _loadSurveyById: LoadSurveyById){}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        await this._loadSurveyById.loadById(httpRequest.params.surveyId)
        return null
    }

}