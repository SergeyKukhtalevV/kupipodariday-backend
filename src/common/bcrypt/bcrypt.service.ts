import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  async getHash(password: string, salt: number) {
    return await hash(password, salt);
  }

  async comparePasswords(passAuth: string, passDBase: string) {
    return await compare(passAuth, passDBase);
  }
}
