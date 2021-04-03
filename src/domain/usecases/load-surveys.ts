import { SurveysModel } from "../models/survey";

export interface ILoadSurveys {
  load(): Promise<SurveysModel[]>;
}
