import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './infrastructure/entities/user.entity';
import { RegisterUserController } from './presentation/controllers/register-user.controller';
import { RegisterUserService } from './application/register-user/register-user.service';
import { EntityManager } from 'typeorm';
import { UserDomainSchemaMapper } from './infrastructure/mappers/user-domain-schema/user-domain-schema.mapper';
import { UserSchemaDomainMapper } from './infrastructure/mappers/user-schema-domain/user-schema-domain.mapper';
import { TypeORMUserRepository } from './infrastructure/repositories/user/type-orm-user.repository';
import { UuidNewUserFactory } from './infrastructure/factories/new-user/uuid-new-user.factory';
import { BCryptPasswordHasher } from './infrastructure/hasher/password-hasher/bcrypt-password.hasher';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [RegisterUserController],
  providers: [{
    provide: RegisterUserService,
    useFactory: (entityManager: EntityManager) => {
      const domainSchemaMapper = new UserDomainSchemaMapper();
      const schemaDomainMapper = new UserSchemaDomainMapper();

      const userRepository = new TypeORMUserRepository(entityManager, domainSchemaMapper, schemaDomainMapper);
      const newUserFactory = new UuidNewUserFactory();
      const passwordHasher = new BCryptPasswordHasher();

      return new RegisterUserService(userRepository, newUserFactory, passwordHasher);
    },
    inject: [EntityManager],
  }],
})
export class UserManagementModule {}
