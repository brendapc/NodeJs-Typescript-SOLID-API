import { ILoadAccountByTokenRepository } from "./../../../data/account/load-account-by-token-repository";
import { Decrypter } from "./../../../data/protocols/decrypter";
import { AccountModel } from "./../../models/account";
import { ILoadAccountByToken } from "./../authentication/load-accountby-token";

export class DBLoadAccountByToken implements ILoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) await this.loadAccountByTokenRepository.loadByToken(token, role);
    return null;
  }
}
