import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat } from './seat.model';
import { EventsModule } from '../events/events.module';
import { Event } from '../events/event.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Seat, Event]),
    forwardRef(() => EventsModule), // allow circular import
  ],
  providers: [SeatsService],
  controllers: [SeatsController],
  exports: [SeatsService, SequelizeModule], // export SequelizeModule for Seat injection
})
export class SeatsModule {}
