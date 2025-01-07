import { env } from './env.config';

export const authConfig = {
  accessToken: {
    secret: env.ACCESS_TOKEN_SECRET || "access",
    expiresIn: parseInt(env.ACCESS_TOKEN_EXPIRES_IN || "3600", 10)
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET || "refresh",
    expiresIn: parseInt(env.REFRESH_TOKEN_EXPIRES_IN || "604800", 10),
  }
};
