import { Controller } from "./../../presentation/protocols";
import { AccountMongoRepository } from "./../../infra/criptography/db/mongodb/account-repository/account";
import { BCryptAdapter } from "./../../infra/criptography/bcrypt-adapter";
import { DbAddAccount } from "./../../data/usecases/add-account/db-add-account";
import { EmailValidatorAdapter } from "./../../utils/email-validator-adapter";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BCryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );
  return new LogControllerDecorator(signUpController);
};