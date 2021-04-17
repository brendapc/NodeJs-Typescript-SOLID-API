import { SurveyResultMongoRepository } from './../../../../../../infra/db/mongodb/survey/survey-result/survey-result-mongo-repository';
import { ISaveSurveyResult } from './../../../../../../domain/usecases/survey-result/save-survey-result';
import { DbSaveSurveyResult } from '../../../../../../data/usecases/suvey-result/save-survey-result/db-save-survey-result';

export const makeDbSaveSurveyResult = (): ISaveSurveyResult  => {
    const surveyResultMongoRepository = new SurveyResultMongoRepository()
    return new DbSaveSurveyResult(surveyResultMongoRepository)
}