import { SurveysModel } from './../../../../../domain/models/survey';
import { Collection } from "mongodb";
import { MongoHelper } from "../../helpers/mongo-helper";
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository";

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection

const makeFakeSurvey = async (): Promise<SurveysModel> => {
    const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }, {
            answer: 'other_answer'
        }] ,
        date: new Date()

    })

return res.ops[0]
}

const makeFakeAccount = async (): Promise<SurveysModel> => {
    const res = await accountCollection.insertOne({
        name: 'any_name',
        email:'any_email',
        password: 'any_password',
        date: new Date()

    })

return res.ops[0]
}

describe("Survey Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection("surveyResults");
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository();
  };
  describe('save()', () => {
    test("Should add a survey result if it is a new one", async () => {
      const sut = makeSut();
      const fakeSurvey =  await makeFakeSurvey()
        const fakeAccount = await makeFakeAccount()
      const surveyResult = await sut.save({
          surveyId: fakeSurvey.id,
          accountId: fakeAccount.id,
          answer: fakeSurvey.answers[0].answer,
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(fakeSurvey.answers[0].answer)
    });
    test('should update a survey result if it is not a new one', async () => {
    const fakeAccount = await makeFakeAccount() 
    const fakeSurvey = await makeFakeSurvey()
    const res = await surveyResultCollection.insertOne({
        surveyId: fakeSurvey.id,
        accountId: fakeAccount.id,
        answer: fakeSurvey.answers[0].answer,
        date: new Date()
    })
    const sut = makeSut()
    const surveyResult = await sut.save({
        surveyId: fakeSurvey.id,
        accountId: fakeAccount.id,
        answer: fakeSurvey.answers[1].answer,
        date: new Date()
    })       
    expect(surveyResult).toBeTruthy()
    expect(surveyResult.id).toEqual(res.ops[0]._id)
    expect(surveyResult.answer).toBe(fakeSurvey.answers[1].answer)
    })
    
 });
});