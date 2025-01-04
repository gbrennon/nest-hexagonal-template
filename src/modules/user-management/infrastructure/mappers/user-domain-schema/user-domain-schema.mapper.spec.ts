import { User } from "@user-management/domain/entities/user";
import { UserDomainSchemaMapper } from "./user-domain-schema.mapper";

describe("UserDomainSchemaMapper", () => {
  const mapper = new UserDomainSchemaMapper();

  describe("map", () => {
    const user = new User(
      "123",
      "John Doe",
      "john@mail.com",
      "password"
    );

    it("should map a User to a UserEntity", () => {
      const userEntity = mapper.map(user);

      expect(userEntity.id).toBe(user.id);
      expect(userEntity.name).toBe(user.name);
      expect(userEntity.email).toBe(user.email);
      expect(userEntity.password).toBe(user.password);
    });
  });
});
