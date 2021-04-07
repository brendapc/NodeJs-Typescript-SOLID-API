import { SurveysModel } from './../../../../domain/models/survey';
export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveysModel[]>;
}
