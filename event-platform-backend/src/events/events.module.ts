import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { Seat } from '../seats/seat.model';
import { SeatsService } from '../seats/seats.service';

@Module({
  imports: [SequelizeModule.forFeature([Event, Seat])],
  controllers: [EventsController],
  providers: [EventsService, SeatsService],
})
export class EventsModule {}
