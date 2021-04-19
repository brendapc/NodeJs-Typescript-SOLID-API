import { ISurveyResultModel } from "../../models/survey-result";

export type ISaveSurveyResultParams = {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
};
export interface ISaveSurveyResult {
  save(data: ISaveSurveyResultParams): Promise<ISurveyResultModel>;
}
