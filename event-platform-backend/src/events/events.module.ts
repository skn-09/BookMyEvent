import { forwardRef, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [SequelizeModule.forFeature([Event]), forwardRef(() => SeatsModule)],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, SequelizeModule],
})
export class EventsModule {}
