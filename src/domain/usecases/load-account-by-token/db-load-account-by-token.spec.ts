import { DBLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "./../../../data/protocols/decrypter";

interface SutTypes {
  sut: DBLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_value"));
    }
  }
  return new DecrypterStub();
};
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DBLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe("DBLoadAccountByToken", () => {
  test("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token"), "any_token";
    expect(decryptSpy).toHaveBeenLastCalledWith("any_token");
  });

  test("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load("any_token", "any_token");
    expect(account).toBeNull();
  });
});
