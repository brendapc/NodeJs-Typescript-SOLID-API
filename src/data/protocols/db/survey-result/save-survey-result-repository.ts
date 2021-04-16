import { ISurveyResultModel } from "../../../../domain/models/survey-result";
import { ISaveSurveyResultModel } from "../../../../domain/usecases/survey-result/save-survey-result";

export interface ISaveSurveyResultRepository {
    save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel>
}