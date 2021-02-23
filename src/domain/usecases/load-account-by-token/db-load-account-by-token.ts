import { Decrypter } from "./../../../data/protocols/decrypter";
import { AccountModel } from "./../../models/account";
import { ILoadAccountByToken } from "./../authentication/load-accountby-token";

export class DBLoadAccountByToken implements ILoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
