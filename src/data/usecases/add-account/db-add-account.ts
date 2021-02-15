import { Encrypter } from "./../../protocols/encrypter";
import { AccountModel } from "../../../domain/models/account";
import {
  AddAccountModel,
  IAddAccount,
} from "./../../../domain/usecases/add-account";
export class DbAddAccount implements IAddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise((resolve) => resolve(null));
  }
}
