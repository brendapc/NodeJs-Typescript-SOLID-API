import { SurveysModel } from "../../../domain/models/survey"
import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository"
import { DbLoadSurveys } from "./db-load-surveys";

interface SutTypes{
    sut: DbLoadSurveys;
    loadSurveyRepository: LoadSurveysRepository;
}
const makeFakeSurveys = (): SurveysModel[] => {
    return [
      {
        id: "any_id",
        question: "any_question",
        answers: [
          {
            image: "any_image",
            answer: "any_answer",
          },
        ],
        date: new Date(),
      },
      {
        id: "other_id",
        question: "other_question",
        answers: [
          {
            image: "other_image",
            answer: "other_answer",
          },
        ],
        date: new Date(),
      },
    ];
  };
  
const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository =>{
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll():  Promise<SurveysModel[]>{
            return new Promise(resolve => resolve(makeFakeSurveys()))
        }
    }
    return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes =>{
    const loadSurveyRepository = makeLoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveyRepository)
    return{
        sut,
        loadSurveyRepository
    }
}
describe('DbLoadSurveys', () => {
    test('should call LoadSurveysRepository ', async () => {
        const { sut, loadSurveyRepository } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyRepository, 'loadAll')
        await sut.load()
        expect(loadSpy).toBeCalled()
    })
    
})
