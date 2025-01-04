import { User } from "@user-management/domain/entities/user";
import UserEntity from "@user-management/infrastructure/entities/user.entity";

export class UserDomainSchemaMapper {
  map(user: User): UserEntity {
    const userEntity = new UserEntity();

    userEntity.id = user.id;
    userEntity.name = user.name;
    userEntity.email = user.email;
    userEntity.password = user.password;

    return userEntity;
  }
}
