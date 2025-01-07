import { env } from "./env.config";

export const dbConfig = {
  host: env.DATABASE_HOST || "localhost",
  port: parseInt(env.DATABASE_PORT || "5432", 10),
  username: env.DATABASE_USERNAME || "postgres",
  password: env.DATABASE_PASSWORD || "password",
  database: env.DATABASE_NAME || "hexagonal_nest_database",
};
