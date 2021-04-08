import { Collection } from "mongodb";
import { sign } from "jsonwebtoken";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";
import env from "../config/env";

let surveyCollection: Collection;
let accountCollection: Collection;

describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("Should return 403 if no accessToken is provided", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "any_question",
          answers: [
            {
              image: "any_image",
              answer: "any_answer",
            },
            {
              answer: "any_answer",
            },
          ],
        })
        .expect(403);
    });
    test("Should return 204 on add survey with valid accessToken", async () => {
      const res = await accountCollection.insertOne({
        name: "Rodrigo",
        email: "rodrigo.manguinho@gmail.com",
        password: "123",
        role: "admin",
      });
      const id = res.ops[0]._id;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            accessToken: accessToken,
          },
        }
      );

      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "any_question",
          answers: [
            {
              image: "any_image",
              answer: "any_answer",
            },
            {
              answer: "any_answer",
            },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
      test('should return 403 on load surveys without token', async () => {
          await request(app).get('/api/surveys').expect(403)
      })
      test("Should return 204 on load survey with valid accessToken", async () => {
        const res = await accountCollection.insertOne({
          name: "Rodrigo",
          email: "rodrigo.manguinho@gmail.com",
          password: "123",
        });
        const id = res.ops[0]._id;
        const accessToken = sign({ id }, env.jwtSecret);
        await accountCollection.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              accessToken: accessToken,
            },
          }
        );
  
        await request(app)
          .get("/api/surveys")
          .set("x-access-token", accessToken)
          .expect(200);
      });
  })
  
});
