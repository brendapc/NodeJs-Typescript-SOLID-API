import { SurveysModel } from '../../../../domain/models/survey';
export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveysModel>;
}
