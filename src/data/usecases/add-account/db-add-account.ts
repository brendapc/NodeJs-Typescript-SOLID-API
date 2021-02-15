import {
  AddAccountModel,
  IAddAccount,
  AccountModel,
  Encrypter,
} from "../../../data/usecases/add-account/db-add-account-protocols";

export class DbAddAccount implements IAddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
