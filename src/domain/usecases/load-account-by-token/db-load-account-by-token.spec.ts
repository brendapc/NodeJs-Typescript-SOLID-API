import { DBLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "./../../../data/protocols/decrypter";

describe("DBLoadAccountByToken", () => {
  test("should call Decrypter with correct values", async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("any_value"));
      }
    }

    const decrypterStub = new DecrypterStub();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    const sut = new DBLoadAccountByToken(decrypterStub);
    await sut.load("any_token");
    expect(decryptSpy).toHaveBeenLastCalledWith("any_token");
  });
});
