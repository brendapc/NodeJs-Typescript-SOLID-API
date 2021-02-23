import { ILoadAccountByTokenRepository } from "./../../../data/account/load-account-by-token-repository";
import { AccountModel } from "./../../models/account";
import { DBLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "./../../../data/protocols/decrypter";

const makeFakeAccount = (): AccountModel => ({
  id: "id",
  name: "name",
  email: "email",
  password: "password",
});

interface SutTypes {
  sut: DBLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: ILoadAccountByTokenRepository;
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new DecrypterStub();
};
const makeLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements ILoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DBLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe("DBLoadAccountByToken", () => {
  test("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token", "any_role");
    expect(decryptSpy).toHaveBeenLastCalledWith("any_token");
  });

  test("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });

  test("should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );
    await sut.load("any_token", "any_role");
    expect(loadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  test("should return null if LoadAccountByTokenRepository returns null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load("any_token", "any_role");
    expect(account).toBeNull();
  });
  test("should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.load("any_token", "any_role");
    expect(account).toEqual(makeFakeAccount());
  });
});
