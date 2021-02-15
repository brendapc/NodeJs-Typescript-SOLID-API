import { AccountModel } from "../../domain/models/account";
import { AddAccountModel } from "../../domain/usecases/add-account";

export interface IAddAccoountRepository{
    add(accountData: AddAccountModel): Promise<AccountModel>
}