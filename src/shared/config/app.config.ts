import { env } from './env.config';

export const appConfig = {
  port: parseInt(env.APP_PORT || "3000", 10),
}
