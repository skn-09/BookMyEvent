import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get(':eventId')
  async getSeats(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.seatsService.getSeatsForEvent(eventId);
  }

  @Post('book/:eventId')
  async bookSeats(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() body: { seats: { row: number; col: number }[] },
  ) {
    return this.seatsService.bookSeatsSimple(eventId, body.seats);
  }
}
