import { Connection } from 'typeorm/connection/Connection';
import * as Bluebird from 'bluebird';
import { createConnection } from 'typeorm';
import { config } from '../config';

export const connectToDB = async (): Promise<Connection> => {
  const connection = await createConnection({
    type: 'postgres',
    host: config.database.host,
    port: parseInt(config.database.port || '5432', 10),
    database: config.database.database,
    username: config.database.username,
    password: config.database.password,
    entities: [`${__dirname}/entities/*.js`],
    subscribers: [`${__dirname}/subscribers/*.js`],
    logging: config.env === 'test',
    promiseLibrary: Bluebird,
    autoReconnect: true,
    // dropSchema: config.env === 'development',
    synchronize: config.env === 'development',
    // migrationsRun: config.env === 'development',
  }).catch(error => {
    throw new Error(error);
  });
  return connection;
};
