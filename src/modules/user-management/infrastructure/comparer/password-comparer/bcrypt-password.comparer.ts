import * as bcrypt from 'bcryptjs';

import {
  PasswordComparer,
  PasswordComparerDTO
} from "@user-management/domain/ports/password.comparer";

export class BCryptPasswordComparer implements PasswordComparer {
    async compare(input: PasswordComparerDTO): Promise<boolean> {
      return await bcrypt.compare(
        input.plainTextPassword,
        input.encryptedPassword
      );
    }
}
