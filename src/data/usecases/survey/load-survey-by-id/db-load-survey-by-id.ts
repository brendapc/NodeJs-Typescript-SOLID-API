import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';
import { SurveysModel } from '../../../../domain/models/survey';
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id';

export class DbLoadSurveyById implements LoadSurveyById {
    constructor(private readonly _loadSurveyByIdRepository: LoadSurveyByIdRepository){}
    async loadById (id: string): Promise<SurveysModel> {
        const survey = await this._loadSurveyByIdRepository.loadById(id)
        return survey

    }
}