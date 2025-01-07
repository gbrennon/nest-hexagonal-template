import { DataSource, EntityManager } from "typeorm";
import { TypeORMUserRepository } from "./type-orm-user.repository";
import {
  AppDataSource
} from '@shared/infrastructure/config/app-data-source';
import {
  UserDomainSchemaMapper
} from "@user-management/infrastructure/mappers/user-domain-schema/user-domain-schema.mapper";
import {
  UserSchemaDomainMapper
} from "@user-management/infrastructure/mappers/user-schema-domain/user-schema-domain.mapper";
import UserEntity from "@user-management/infrastructure/entities/user.entity";
import { User } from "@user-management/domain/entities/user";
import { ConflictException } from "@nestjs/common";

describe('TypeORMUserRepository Integration Test', () => {
  let repository: TypeORMUserRepository;
  let dataSource: DataSource;
  let entityManager: EntityManager;
  let userDomainSchemaMapper: UserDomainSchemaMapper;
  let userSchemaDomainMapper: UserSchemaDomainMapper;

  const userId = 'uuid123';
  const userName = 'John Doe';
  const userEmail = 'john@example.com';
  const userPassword = 'hashedpassword123';

  const fakeUser = new User(userId, userName, userEmail, userPassword);

  beforeAll(async () => {
    dataSource = AppDataSource;  // Assuming false for non-test environment
    await dataSource.initialize();

    entityManager = dataSource.manager;
    userDomainSchemaMapper = new UserDomainSchemaMapper();
    userSchemaDomainMapper = new UserSchemaDomainMapper();

    repository = new TypeORMUserRepository(
      entityManager,
      userDomainSchemaMapper,
      userSchemaDomainMapper
    );
  });

  afterEach(async () => {
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      // Create a new user using a literal object and save it
      await dataSource.manager.save(UserEntity, {
        id: fakeUser.id,
        name: fakeUser.name,
        email: fakeUser.email,
        password: fakeUser.password,
      });

      const result = await repository.findByEmail(fakeUser.email);
      expect(result).toEqual(fakeUser);
    });

    it('should return null if no user is found', async () => {
      const result = await repository.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save the user correctly', async () => {
      await repository.save(fakeUser);

      const savedUserEntity = await dataSource.manager.findOne(UserEntity, {
        where: { email: fakeUser.email },
      });

      expect(savedUserEntity).not.toBeNull();
      expect(savedUserEntity!.name).toEqual(fakeUser.name);
      expect(savedUserEntity!.email).toEqual(fakeUser.email);
      expect(savedUserEntity!.password).toEqual(fakeUser.password);
    });

    it('should throw ConflictException if the email already exists', async () => {
      await repository.save(fakeUser);

      const duplicateUser = new User('uuid456', 'Jane Doe', fakeUser.email, 'anotherpassword');

      await expect(repository.save(duplicateUser)).rejects.toThrow(
        new ConflictException('User already exists')
      );
    });
  });
});
