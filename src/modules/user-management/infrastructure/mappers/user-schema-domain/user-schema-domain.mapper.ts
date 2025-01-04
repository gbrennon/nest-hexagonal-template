import { User } from "@user-management/domain/entities/user";
import UserEntity from "@user-management/infrastructure/entities/user.entity";

export class UserSchemaDomainMapper {
  map(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.name,
      userEntity.email,
      userEntity.password
    );
  }
}
