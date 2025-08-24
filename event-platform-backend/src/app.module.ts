import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { SeatsModule } from './seats/seats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: (process.env.DB_DIALECT || 'mysql') as any,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'neosoft',
      database: process.env.DB_NAME || 'event_data_final',
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    EventsModule,
    SeatsModule,
  ],
})
export class AppModule {}
