import { serverError } from './../../../../../helpers/http/http-helper';
import { InvalidParamError } from './../../../../../errors/invalid-param-error';
import { LoadSurveyById } from './../../../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest, HttpResponse } from '../../add-survey/add-survey-controller-protocols';
import { Controller } from './../../../../../protocols/controller';
import { forbbiden } from '../../../../../helpers/http/http-helper';

export class SaveSurveyResultController implements Controller{
    constructor(private readonly _loadSurveyById: LoadSurveyById){}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try{
            const { surveyId } = httpRequest.params
            const { answer }= httpRequest.body
            const survey = await this._loadSurveyById.loadById(surveyId)
            if(survey){
                const answers = survey.answers.map((answersList)=> answersList.answer)
                if(!answers.includes(answer)){
                    return forbbiden(new InvalidParamError('answer'))
                }
            }else{
                return forbbiden( new InvalidParamError('surveyId'))
            }
                return null
        }catch(err){
            return serverError(err)
        }
    }

}