import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_DATABASE || 'acm',
    username: process.env.DB_USERNAME || 'lednhatkhanh',
    password: process.env.DB_PASSWORD || 'Abc123@@',
  },
  authKeys: {
    jwtKey: process.env.JWT_KEY || 'ThisIsSecretKey',
    jwtRefreshKey: process.env.JWT_REFRESH_KEY || 'ThisIsRefreshSeretKey',
  },
};
