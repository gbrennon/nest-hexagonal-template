import { v4 as uuidv4 } from 'uuid';

import { User } from "@user-management/domain/entities/user";
import {
  NewUserInput,
  NewUserFactory
} from "@user-management/domain/ports/new-user.factory";

export class UuidNewUserFactory implements NewUserFactory {
  create(input: NewUserInput): User {
    const id = uuidv4();

    return new User(
      id,
      input.name,
      input.email,
      input.password,
    );
  }
}
