import { BCryptAdapter } from "./bcrypt-adapter";
import bcrypt, { hash } from "bcrypt";

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hashed_password')
    }
}))

describe("BCrypt Adapter", () => {
  test("should call BCrypt with correct value", async () => {
    const salt = 12;
    const sut = new BCryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test('should return a hash on success', async () => {
    const salt = 12;
    const sut = new BCryptAdapter(salt);
    const hashedValue = await sut.encrypt("any_value");
    expect(hashedValue).toBe('hashed_password')
  })
  
});
