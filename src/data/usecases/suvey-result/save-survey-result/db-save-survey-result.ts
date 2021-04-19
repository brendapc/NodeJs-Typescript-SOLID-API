import { resolve } from 'node:path';
import { ISaveSurveyResultParams } from '../../../../domain/usecases/survey-result/save-survey-result';
import { ISurveyResultModel } from '../../../../domain/models/survey-result';
import { ISaveSurveyResult } from '../../../../domain/usecases/survey-result/save-survey-result';
import { ISaveSurveyResultRepository } from '../../../protocols/db/survey-result/save-survey-result-repository';
export class DbSaveSurveyResult implements ISaveSurveyResultRepository {
    constructor(private readonly saveSurveyResultRepository: ISaveSurveyResultRepository){}
    async save(data: ISaveSurveyResultParams): Promise<ISurveyResultModel>{
        const surveyResult = await this.saveSurveyResultRepository.save(data)
        return surveyResult

    }

}