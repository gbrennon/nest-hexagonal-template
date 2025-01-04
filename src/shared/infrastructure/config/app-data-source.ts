import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from './get-type-orm.config';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const config = getTypeOrmConfig(isTestEnvironment);

export const AppDataSource = new DataSource(config);
