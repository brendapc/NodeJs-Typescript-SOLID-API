import { resolve } from 'node:path';
import { ISaveSurveyResultModel } from './../../../domain/usecases/save-survey-result';
import { ISurveyResultModel } from './../../../domain/models/survey-result';
import { ISaveSurveyResult } from '../../../domain/usecases/save-survey-result';
import { ISaveSurveyResultRepository } from './../../protocols/db/survey/save-survey-result-repository';
export class DbSaveSurveyResult implements ISaveSurveyResultRepository {
    constructor(private readonly saveSurveyResultRepository: ISaveSurveyResultRepository){}
    async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel>{
        const surveyResult = await this.saveSurveyResultRepository.save(data)
        return surveyResult

    }

}