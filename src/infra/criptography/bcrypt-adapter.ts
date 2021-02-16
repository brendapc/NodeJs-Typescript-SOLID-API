import { Encrypter } from "./../../data/protocols/encrypter";
import bcrypt from "bcrypt";

export class BCryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {} //passa no construtor e não na função "encrypt" pois a função deve ser idependete de biblioteca, e o salt é específico do BCrypt

  async encrypt(value: string): Promise<string> {
    const hashed_value = await bcrypt.hash(value, this.salt);
    return hashed_value;
  }
}
