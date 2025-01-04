import { User } from "@user-management/domain/entities/user";

export interface NewUserInput {
  name: string;
  email: string;
  password: string;
}

export interface NewUserFactory {
  create(input: NewUserInput): User;
}
