import * as bcrypt from 'bcryptjs';
import { PasswordHasher } from "@user-management/domain/ports/password.hasher";


export class BCryptPasswordHasher implements PasswordHasher {
  public async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  }
}
