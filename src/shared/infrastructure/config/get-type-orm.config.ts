import { DataSourceOptions } from "typeorm";
import { join } from "path";
import { globSync } from "glob";
import { dbConfig } from "@shared/config/db.config";

export function getTypeOrmConfig(
  isTestEnvironment: boolean
): DataSourceOptions {

  const entityFiles = globSync(
    join(__dirname, "../../../../**/**/entities/*.entity.{ts,js}")
  );

  const entities = entityFiles
    .map((file) => {
      // Dynamically import each entity file
      const schemaModule = require(file);
      return schemaModule.default;
    })
    .filter((schema) => schema);

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
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: true,
    logging: true,
    entities: entities,
  };
}
