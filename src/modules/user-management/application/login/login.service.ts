import { InvalidCredentialsError } from "@user-management/domain/errors/invalid-credentials.error";
import {
  PasswordComparer
} from "@user-management/domain/ports/password.comparer";
import {
  TokenDTO, TokenGenerator
} from "@user-management/domain/ports/token.generator";
import { UserRepository } from "@user-management/domain/ports/user.repository";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  access: TokenDTO;
  refresh: TokenDTO;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordComparer: PasswordComparer,
    private readonly accessTokenGenerator: TokenGenerator,
    private readonly refreshTokenGenerator: TokenGenerator,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordCorrect = await this.passwordComparer.compare({
      plainTextPassword: input.password,
      encryptedPassword: user.password
    });

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }

    const access = this.accessTokenGenerator.generate(user.id);
    const refresh = this.refreshTokenGenerator.generate(user.id);

    return {
      access,
      refresh,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
}
