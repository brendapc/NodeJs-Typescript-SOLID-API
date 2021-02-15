import { Encrypter } from "./../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  const encrypterStub = new EncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call encrypter with correct password", () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    sut.add(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith(accountData.password);
  });
});