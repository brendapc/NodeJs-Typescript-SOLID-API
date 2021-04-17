import { Decrypter } from "../../../protocols/cryptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { LoadAccountByTokenRepository } from "../../../protocols/db/account/load-account-by-token-repository";
import { LoadAccountByToken } from "../../../../domain/usecases/account/load-account-by-token";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly _decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this._decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      );
      if (account) return account;
    }
    return null;
  }
}
