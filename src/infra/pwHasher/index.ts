import { Injectable, Provider } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export default class ArgonPwHasher {
  // Hash password using Argon2
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  // Verify the password against the stored hash
  async verifyPassword(storedHash: string, password: string): Promise<boolean> {
    return await argon2.verify(storedHash, password);
  }
}

export const HashingServiceProvider: Provider<ArgonPwHasher> = {
  provide: ArgonPwHasher,
  useClass: ArgonPwHasher,
};
