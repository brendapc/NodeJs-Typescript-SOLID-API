import { InvalidParamError } from './../../../../../errors/invalid-param-error';
import { LoadSurveyById } from './../../../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest, HttpResponse } from '../../add-survey/add-survey-controller-protocols';
import { Controller } from './../../../../../protocols/controller';
import { forbbiden } from '../../../../../helpers/http/http-helper';

export class SaveSurveyResultController implements Controller{
    constructor(private readonly _loadSurveyById: LoadSurveyById){}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const survey = await this._loadSurveyById.loadById(httpRequest.params.surveyId)
        if(!survey) return forbbiden( new InvalidParamError('surveyId'))
        return null
    }

}