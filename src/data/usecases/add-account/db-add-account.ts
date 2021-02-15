import {
  AddAccountModel,
  IAddAccount,
  AccountModel,
  Encrypter,
  IAddAccoountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: IAddAccoountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const createdAccount = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    );// criar um objeto novo e substituir o campo password
    return createdAccount;
  }
}
