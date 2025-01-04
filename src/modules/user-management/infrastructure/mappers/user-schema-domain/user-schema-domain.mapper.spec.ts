import { User } from "@user-management/domain/entities/user";
import UserEntity from "@user-management/infrastructure/entities/user.entity";
import { UserSchemaDomainMapper } from "./user-schema-domain.mapper";

describe("UserSchemaDomainMapper", () => {
  const mapper = new UserSchemaDomainMapper();

  describe("map", () => {
    const userEntity = new UserEntity();
    userEntity.id = "123";
    userEntity.name = "John Doe";
    userEntity.email = "john@email.com";
    userEntity.password = "password";

    it("should map a UserEntity to a User", () => {
      const user = mapper.map(userEntity);

      const expectedUser = new User(
        userEntity.id,
        userEntity.name,
        userEntity.email,
        userEntity.password
      );
      expect(user).toEqual(expectedUser);
    });
  });
});
