import { getTypeOrmConfig } from './get-type-orm.config';
import { DataSourceOptions } from 'typeorm';

describe('getTypeOrmConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear module cache
    process.env = { ...originalEnv }; // Reset environment variables
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original environment
  });

  it('should return SQLite configuration for test environment', () => {
    const config: DataSourceOptions = getTypeOrmConfig(true);

    expect(config).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        dropSchema: true,
        entities: expect.arrayContaining([
          expect.any(Function), // Ensures that the entities array contains functions (schemas)
        ]),
      })
    );
  });

  it('should return PostgreSQL configuration for production environment', () => {
    process.env.DATABASE_HOST = 'production-db';
    process.env.DATABASE_PORT = '5432';
    process.env.DATABASE_USERNAME = 'prod_user';
    process.env.DATABASE_PASSWORD = 'secure_password';
    process.env.DATABASE_NAME = 'prod_database';

    const config: DataSourceOptions = getTypeOrmConfig(false);

    expect(config).toEqual(
      expect.objectContaining({
        type: 'postgres',
        host: 'production-db',
        port: 5432,
        username: 'prod_user',
        password: 'secure_password',
        database: 'prod_database',
        synchronize: true,
        logging: true,
        entities: expect.arrayContaining([
          expect.any(Function), // Ensures that the entities array contains functions (schemas)
        ]),
      })
    );
  });

  it('should use default PostgreSQL values if environment variables are not set', () => {
    delete process.env.DATABASE_HOST;
    delete process.env.DATABASE_PORT;
    delete process.env.DATABASE_USERNAME;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.DATABASE_NAME;

    const config: DataSourceOptions = getTypeOrmConfig(false);

    expect(config).toEqual(
      expect.objectContaining({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'hexagonal_nest_database',
        synchronize: true,
        logging: true,
        entities: expect.arrayContaining([
          expect.any(Function), // Ensures that the entities array contains functions (schemas)
        ]),
      })
    );
  });
});

