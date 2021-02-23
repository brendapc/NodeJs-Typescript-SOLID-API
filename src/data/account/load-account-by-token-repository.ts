import { AccountModel } from "../../domain/models/account";

export interface ILoadAccountByTokenRepository {
  loadByToken(token: string): Promise<AccountModel>;
}
