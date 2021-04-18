import { ISaveSurveyResult } from './../../../../../../domain/usecases/survey-result/save-survey-result';
import { ok, serverError } from './../../../../../helpers/http/http-helper';
import { InvalidParamError } from './../../../../../errors/invalid-param-error';
import { LoadSurveyById } from './../../../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest, HttpResponse } from '../../add-survey/add-survey-controller-protocols';
import { Controller } from './../../../../../protocols/controller';
import { forbbiden } from '../../../../../helpers/http/http-helper';

export class SaveSurveyResultController implements Controller{
    constructor(
        private readonly _loadSurveyById: LoadSurveyById,
        private readonly _saveSurveyResult: ISaveSurveyResult
        ){}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            const { surveyId } = httpRequest.params
            const { answer }= httpRequest.body
            const { accountId }= httpRequest
            const survey = await this._loadSurveyById.loadById(surveyId)
            if(survey){
                const answers = survey.answers.map((answersList)=> answersList.answer)
                if(!answers.includes(answer)){
                    return forbbiden(new InvalidParamError('answer'))
                }
            }else{
                return forbbiden( new InvalidParamError('surveyId'))
            }
            const surveyResult = await this._saveSurveyResult.save({
                accountId,
                surveyId,
                answer,
                date: new Date()
            })
            return ok(surveyResult)
        }catch(err){
            return serverError(err)
        }
    }

}