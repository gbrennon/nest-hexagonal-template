import { EntityManager } from "typeorm";
import { ConflictException } from '@nestjs/common';
import {
  UserRepository
} from "@user-management/domain/ports/user.repository";
import { User } from "@user-management/domain/entities/user";
import UserEntity from "../../entities/user.entity";
import {
  UserDomainSchemaMapper
} from "../../mappers/user-domain-schema/user-domain-schema.mapper";
import {
  UserSchemaDomainMapper
} from "../../mappers/user-schema-domain/user-schema-domain.mapper";

export class TypeORMUserRepository implements UserRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly userDomainSchemaMapper: UserDomainSchemaMapper,
    private readonly userSchemaDomainMapper: UserSchemaDomainMapper
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.entityManager.findOne(
      UserEntity,
      { where: { email: email } }
    );

    if (!userEntity) {
      return null;
    }

    return this.userSchemaDomainMapper.map(userEntity);
  }

  async save(user: User): Promise<void> {
    const userEntity = this.userDomainSchemaMapper.map(user);

    try {
      await this.entityManager.save(userEntity);
    } catch (error) {
      if(this.isUniqueConstraintViolation(error)) {
        throw new ConflictException('User already exists');
      }
    }
  }

  private isUniqueConstraintViolation(error: any): boolean {
        // PostgreSQL error code for unique violation
    const isPostgresUniqueViolation = error.code === '23505'; 

    // SQLite error code for unique violation
    const isSQLiteUniqueViolation = error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE');

    return isPostgresUniqueViolation || isSQLiteUniqueViolation;
  }
}
