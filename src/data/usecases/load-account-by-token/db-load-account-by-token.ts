import { Decrypter } from "./../../protocols/cryptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { LoadAccountByToken } from "./../../../domain/usecases/load-account-by-token";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly _decrypter: Decrypter) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this._decrypter.decrypt(accessToken);
    return new Promise((resolve) => resolve(null));
  }
}
