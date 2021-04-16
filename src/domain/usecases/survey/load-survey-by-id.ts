import { SurveysModel } from "../../models/survey";

export interface LoadSurveyById {
    loadById (id: string): Promise<SurveysModel>
}