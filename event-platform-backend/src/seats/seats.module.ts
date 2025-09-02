import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat } from './seat.model';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [SequelizeModule.forFeature([Seat]), forwardRef(() => EventsModule)],
  providers: [SeatsService],
  controllers: [SeatsController],
  exports: [SeatsService, SequelizeModule],
})
export class SeatsModule {}
