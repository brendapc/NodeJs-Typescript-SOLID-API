import { SurveysModel } from './../../../../domain/models/survey';
import { MongoHelper } from './../helpers/mongo-helper';
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { AddSurveyRepository } from "./../../../../data/protocols/db/survey/add-survey-repository";

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const result = await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveysModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: SurveysModel[] = await surveyCollection.find().toArray()
    return surveys
  }
}
