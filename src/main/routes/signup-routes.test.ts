import request from "supertest";
import { MongoHelper } from "../../infra/criptography/db/mongodb/account-repository/helpers/mongo-helper";
import app from "../config/app";

describe("Signup Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  test("should return an account on success", async () => {
    await request(app)
      .post("/api/signup ")
      .send({
        name: "Brenda",
        email: "Brenda@mail.com",
        password: "123456",
        passwordConfirmation: "123456",
      })
      .expect(200);
  });
});
