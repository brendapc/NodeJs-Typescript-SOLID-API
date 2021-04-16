import { LoadSurveyById } from './../../../../../../domain/usecases/survey/load-survey-by-id';
import { HttpRequest } from "../../add-survey/add-survey-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import { SurveysModel } from '../../load-survey/load-survey-controller-protocols';

interface SutTypes {
    sut: SaveSurveyResultController;
    loadSurveyByIdStub: LoadSurveyById;
}  

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

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById (id: string): Promise<SurveysModel> {
            return new Promise((resolve)=> resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyByIdStub()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub);
    return {
      sut,
      loadSurveyByIdStub
    };
};
const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    }
})

describe('SaveSurveyResultController', () => {
    test('should call LoadSurveyById with correct values', async () => {
        const {sut, loadSurveyByIdStub} = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
    /* test('should return 403 if loadSurveyById returns null', async () => {
        const {sut} = makeSut()
        await sut.handle(makeFakeRequest())
    }) */
    
})
