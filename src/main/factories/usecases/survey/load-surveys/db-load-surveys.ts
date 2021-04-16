import { DbLoadSurveys } from '../../../../../data/usecases/survey/load-surveys/db-load-surveys';
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository';
import { ILoadSurveys } from '../../../../../domain/usecases/survey/load-surveys';
export const makeDbLoadSurveys = (): ILoadSurveys =>{
    const surveysMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveysMongoRepository)
}