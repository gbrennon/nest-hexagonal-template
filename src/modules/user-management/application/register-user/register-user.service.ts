import {
  NewUserFactory
} from "@user-management/domain/ports/new-user.factory";
import { PasswordHasher } from "@user-management/domain/ports/password.hasher";
import { UserRepository } from "@user-management/domain/ports/user.repository";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserOutput {
  id: string;
}

export class RegisterUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly newUserFactory: NewUserFactory,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const { name, email, password } = input;
    const hashedPassword = await this.passwordHasher.hash(password);

    const user = this.newUserFactory.create({
      name,
      email,
      password: hashedPassword
    });

    await this.userRepository.save(user);

    return { id: user.id };
  }
}
