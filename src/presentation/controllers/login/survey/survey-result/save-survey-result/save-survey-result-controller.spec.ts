import { ISaveSurveyResult, ISaveSurveyResultModel } from './../../../../../../domain/usecases/survey-result/save-survey-result';
import { HttpResponse } from './../../../../../protocols/http';
import { serverError } from './../../../../../helpers/http/http-helper';
import { InvalidParamError } from './../../../../../errors/invalid-param-error';
import { LoadSurveyById } from './../../../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest } from "../../add-survey/add-survey-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import { SurveysModel } from '../../load-survey/load-survey-controller-protocols';
import { forbbiden } from '../../../../../helpers/http/http-helper';
import MockDate from "mockdate";
import { ISurveyResultModel } from '../../../../../../domain/models/survey-result';

interface SutTypes {
    sut: SaveSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
    saveSurveyResultStub: ISaveSurveyResult;
}  
const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    },
    body: {
        answer: 'any_answer'
    },
    accountId: 'any_account_id'
})

const makeFakeSurvey = (): SurveysModel => ({
        id: "any_id",
        question: "any_question",
        answers: [
          {
            image: "any_image",
            answer: "any_answer",
          },
        ],
        date: new Date(),
});

const makeFakeSurveyResult = (): ISurveyResultModel => ({
    id: "valid_id",
    surveyId: "valid_survey_id",
    accountId: 'any_account_id',
    answer: "valid_answer",
    date: new Date(),
});

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById (id: string): Promise<SurveysModel> {
            return new Promise((resolve)=> resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): ISaveSurveyResult => {
    class SaveSurveyResultStub implements ISaveSurveyResult {
        async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel>{
            return new Promise((resolve)=> resolve(makeFakeSurveyResult()))
        }
    }
    return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyByIdStub()
    const saveSurveyResultStub = makeSaveSurveyResultStub()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub,saveSurveyResultStub);
    return {
      sut,
      loadSurveyByIdStub,
      saveSurveyResultStub
    };
};

describe('SaveSurveyResultController', () => {
    beforeAll(() => {
        MockDate.set(new Date());
      });
    
      afterAll(() => {
        MockDate.reset();
      });
    
      describe('loadSurveyById', () => {
          
          
          test('should call LoadSurveyById with correct values', async () => {
              const {sut, loadSurveyByIdStub} = makeSut()
              const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
              await sut.handle(makeFakeRequest())
              expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
            })
            test('should return 403 if loadSurveyById returns null', async () => {
                const {sut, loadSurveyByIdStub} = makeSut()
                jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
                const httpResponse = await sut.handle(makeFakeRequest())
                expect(httpResponse).toEqual(forbbiden(new InvalidParamError('surveyId')))
            })
            
            test('should return 500 if LoadSurveyById throws', async () => {
                const {sut, loadSurveyByIdStub} = makeSut()
                jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Promise((resolve, reject)=> reject(new Error())))
                const httpResponse = await sut.handle(makeFakeRequest())
                expect(httpResponse).toEqual(serverError(new Error()))
    })
    
    test('should return 403 if a invalid answer is provided', async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle({
            params: {
                surveyId: 'any_survey_id'
            },        
            body: {
                answer: 'wrong_answer'
            }
        })
        expect(httpResponse).toEqual(forbbiden(new InvalidParamError('answer')))
    })
})
    test('should call SaveSurveyResult with correct values', async () => {
        const {sut, saveSurveyResultStub} = makeSut()
        const saveSurveySpy =  jest.spyOn(saveSurveyResultStub, 'save')
        await sut.handle(makeFakeRequest())
        expect(saveSurveySpy).toHaveBeenCalledWith({ 
            surveyId: 'any_survey_id',
            accountId: 'any_account_id',
            date: new Date(),
            answer: 'any_answer',
        })
    })
})
