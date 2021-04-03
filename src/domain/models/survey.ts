import { SurveyAnswerModel } from "./survey-answer";

export interface SurveysModel {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
