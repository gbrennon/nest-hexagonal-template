import { DataSourceOptions } from "typeorm";
import { join } from "path";
import { globSync } from "glob";
import UserEntity from '../../../modules/user-management/infrastructure/entities/user.entity';

export function getTypeOrmConfig(
  isTestEnvironment: boolean
): DataSourceOptions {

  // const entityFiles = globSync(
  //   join(__dirname, "../../../../**/**/entities/*.ts")
  // );

  // const entities = entityFiles
  //   .map((file) => {
  //     const schemaModule = require(file);

  //     return schemaModule.default
  //   })
  //   .filter((schema) => schema);
  const entities = [UserEntity];

  // Return configuration based on the environment (Test or Production)
  if (isTestEnvironment) {
    return {
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      dropSchema: true,
      entities: entities,
    };
  }

  return {
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "password",
    database: process.env.DATABASE_NAME || "hexagonal_nest_database",
    synchronize: true,
    logging: true,
    entities: entities,
  };
}
