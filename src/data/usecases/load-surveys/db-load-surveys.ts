import { LoadSurveysRepository } from './../../protocols/db/survey/load-surveys-repository';
import { SurveysModel } from '../../../domain/models/survey';
import { ILoadSurveys } from './../../../domain/usecases/load-surveys';

export class DbLoadSurveys implements ILoadSurveys {
  constructor(private readonly _loadSurveysRepository: LoadSurveysRepository){

  }
  async load(): Promise<SurveysModel[]>{
    await this._loadSurveysRepository.loadAll()
    return []
  }
} 