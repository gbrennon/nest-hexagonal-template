import * as  jwt from "jsonwebtoken";

import { TokenDTO, TokenGenerator } from "@user-management/domain/ports/token.generator";

export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: number
  ) {}

  generate(id: string): TokenDTO {
    const token = jwt.sign({ id }, this.secret, {
      expiresIn: this.expiresIn
    });

    return {
      token,
      expiresIn: this.expiresIn
    };
  }
}
