import { forwardRef, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { SeatsModule } from '../seats/seats.module';
import { Seat } from '../seats/seat.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Event]),
    forwardRef(() => SeatsModule), // allow circular import
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // so SeatsModule can use it if needed
})
export class EventsModule {}
