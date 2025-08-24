import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat } from './seat.model';
import { Event } from '../events/event.model';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [SequelizeModule.forFeature([Seat, Event]), EventsModule],
  providers: [SeatsService],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule {}
