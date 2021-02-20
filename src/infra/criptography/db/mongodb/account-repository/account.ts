import { MongoHelper } from "./helpers/mongo-helper";
import { IAddAccoountRepository } from "../../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../../domain/models/account";
import { AddAccountModel } from "../../../../../domain/usecases/add-account";

export class AccountMongoRepository implements IAddAccoountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const newAccountData = result.ops[0];

    return MongoHelper.map(newAccountData)
  }
}
