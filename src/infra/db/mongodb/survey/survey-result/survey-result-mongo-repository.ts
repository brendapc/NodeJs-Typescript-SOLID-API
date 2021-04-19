import { MongoHelper } from './../../helpers/mongo-helper';
import { ISaveSurveyResultParams } from '../../../../../domain/usecases/survey-result/save-survey-result';
import { ISaveSurveyResultRepository } from '../../../../../data/protocols/db/survey-result/save-survey-result-repository';
import { ISurveyResultModel } from './../../../../../domain/models/survey-result';
export class SurveyResultMongoRepository implements ISaveSurveyResultRepository {

    async save(data: ISaveSurveyResultParams): Promise<ISurveyResultModel>{
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        const res = await surveyResultCollection.findOneAndUpdate({
            surveyId: data.surveyId,
            accountId: data.accountId
        },
        {
            $set: {
                answer: data.answer,
                date: data.date
            }
        },{
            upsert: true,
            returnOriginal: false
        })
        return res.value && MongoHelper.map(res.value)
    }

}