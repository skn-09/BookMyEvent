import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig = (): SequelizeModuleOptions => ({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  synchronize: true, // For demo; use migrations in production
  logging: false,
});
